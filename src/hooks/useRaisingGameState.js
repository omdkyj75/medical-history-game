import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gameConfig from "../data/gameConfig.json";
import resultTypesData from "../data/resultTypes.json";
import { saveResult, getResults } from "../utils/resultStorage";
import { checkNewAchievements } from "../utils/checkAchievements";
import { getSeason, getSeasonBonus } from "../utils/seasonCalculator";
import { checkTraits, getTraitBonus, hasStaminaSave, applyReputationProtect } from "../utils/traitSystem";
import bossEventsData from "../data/bossEvents.json";
import pressureEventsData from "../data/pressureEvents.json";
import npcData from "../data/npcs.json";
import medicalTextsData from "../data/medicalTexts.json";
import scholarLineageData from "../data/scholarLineage.json";

const { stats, eras, activities, gameMeta } = gameConfig;

// A6: 시대별 랜덤 수식어 풀
const ERA_MODIFIERS = [
  { id: "abundant", name: "풍년(豐年)", hanja: "豐", desc: "풍요로운 시절 — 체력 소모 1 감소", deltaAdjust: { stamina: 1 } },
  { id: "plague", name: "역병(疫病)", hanja: "疫", desc: "전염병 유행 — 체력 소모 1 증가, 의술 +1", deltaAdjust: { stamina: -1, medical: 1 } },
  { id: "renaissance", name: "학술부흥(學術復興)", hanja: "興", desc: "학문이 번성 — 학식 +1 추가", deltaAdjust: { knowledge: 1 } },
  { id: "isolation", name: "쇄국(鎖國)", hanja: "鎖", desc: "외부와 단절 — 명성 획득 절반, 덕행 +1", reputationHalf: true, deltaAdjust: { virtue: 1 } },
  { id: "greatdoctor", name: "명의출현(名醫出現)", hanja: "名", desc: "명의가 나타남 — 사승방문 효과 2배", doubleActivity: "visit-master" },
  { id: "war", name: "전란(戰亂)", hanja: "戰", desc: "전쟁의 시대 — 민간봉사 덕행 2배, 체력 소모 1 증가", doubleActivity: "public-service", deltaAdjust: { stamina: -1 } }
];

const SCREEN_TO_HASH = {
  start: "#/",
  howToPlay: "#/how-to-play",
  raising: "#/raising",
  final: "#/final",
  history: "#/history",
  achievements: "#/achievements",
  collection: "#/collection",
  lineage: "#/lineage",
  glossary: "#/glossary",
};

const HASH_TO_SCREEN = Object.fromEntries(
  Object.entries(SCREEN_TO_HASH).map(([k, v]) => [v, k])
);

const GUARDED_SCREENS = new Set(["raising", "final"]);

function screenFromHash() {
  const hash = window.location.hash || "#/";
  const screen = HASH_TO_SCREEN[hash];
  if (!screen || GUARDED_SCREENS.has(screen)) return "start";
  return screen;
}

function cloneInitialStats() {
  return { ...stats.initial };
}

function clampStat(key, value) {
  return Math.max(0, Math.min(stats.max[key] || 100, value));
}

function applyDelta(currentStats, delta) {
  const next = { ...currentStats };
  for (const [key, val] of Object.entries(delta)) {
    if (key in next) {
      next[key] = clampStat(key, next[key] + val);
    }
  }
  return next;
}

function getActivityDelta(activityId, era) {
  let activity = activities.find((a) => a.id === activityId);
  if (!activity) {
    // Check era-specific activities
    activity = era?.eraActivities?.find((a) => a.id === activityId);
  }
  if (!activity) return {};

  const base = { ...activity.baseDelta };
  const override = era?.activityOverrides?.[activityId];
  if (override?.bonusDelta) {
    for (const [key, val] of Object.entries(override.bonusDelta)) {
      base[key] = (base[key] || 0) + val;
    }
  }
  return base;
}

function pickRandomEvent(era, seenIds = new Set()) {
  const events = era?.events;
  if (!events || events.length === 0) return null;

  // Exclude already-seen events in this era
  const unseen = events.filter((e) => !seenIds.has(e.id));
  if (unseen.length === 0) return null;

  // Filter by probability
  const candidates = unseen.filter(
    (e) => Math.random() < (e.probability ?? 0.4)
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// Evaluate result type for 5-stat system (stamina excluded)
function evaluateResultType(currentStats) {
  const scores = {
    medical: currentStats.medical,
    knowledge: currentStats.knowledge,
    virtue: currentStats.virtue,
    reputation: currentStats.reputation
  };

  const { resultTypes, comboTypes, scorePriorityOrder } = resultTypesData;

  // Check combo endings first
  if (comboTypes?.length > 0) {
    const matched = comboTypes.find((combo) => {
      const { keys, minEach } = combo.rule;
      return keys.every((key) => scores[key] >= minEach);
    });
    if (matched) return matched;
  }

  // Check balanced
  const balancedType = resultTypes.find((t) => t.rule.type === "range");
  if (balancedType) {
    const keys = balancedType.rule.keys || Object.keys(scores);
    const vals = keys.map((k) => scores[k]);
    const range = Math.max(...vals) - Math.min(...vals);
    if (range <= balancedType.rule.maxMinusMinLte) return balancedType;
  }

  // Top-score types
  const topScoreTypes = resultTypes
    .filter((t) => t.rule.type === "top-score")
    .sort((a, b) => a.priority - b.priority);

  const maxVal = Math.max(...Object.values(scores));

  const matched = topScoreTypes.filter((t) => scores[t.rule.primary] === maxVal);

  if (matched.length === 1) return matched[0];
  if (matched.length > 1) {
    for (const pk of scorePriorityOrder) {
      const found = matched.find((t) => t.rule.primary === pk);
      if (found) return found;
    }
    return matched[0];
  }

  // Fallback: highest score by priority
  const topKeys = Object.keys(scores).filter((k) => scores[k] === maxVal);
  for (const pk of scorePriorityOrder) {
    if (topKeys.includes(pk)) {
      const found = topScoreTypes.find((t) => t.rule.primary === pk);
      if (found) return found;
    }
  }

  return resultTypes[0];
}

export function useRaisingGameState() {
  const [playerName, setPlayerName] = useState("");
  const [screen, setScreenRaw] = useState(screenFromHash);
  const [eraIndex, setEraIndex] = useState(0);
  const [turnIndex, setTurnIndex] = useState(0);
  // phases: activity-select, activity-result, minigame, event, era-transition, final
  const [phase, setPhase] = useState("activity-select");
  const [minigameType, setMinigameType] = useState(null);
  const [playerStats, setPlayerStats] = useState(cloneInitialStats);
  const statsRef = useRef(playerStats);
  const [turnHistory, setTurnHistory] = useState([]);
  const turnHistoryRef = useRef(turnHistory);
  const [activityCounts, setActivityCounts] = useState({});

  // NPC affinity
  const [npcAffinities, setNpcAffinities] = useState({});
  const [pendingNpcEvent, setPendingNpcEvent] = useState(null);

  // Boss event & Pressure
  const [currentBossEvent, setCurrentBossEvent] = useState(null);
  const [currentPressure, setCurrentPressure] = useState(null);

  // Seen events tracking (prevents duplicate events within same era)
  const [seenEventIds, setSeenEventIds] = useState(new Set());

  // Seen pressure events tracking (prevents repeats)
  const [lastPressureTitle, setLastPressureTitle] = useState(null);

  // Academic collection tracking
  const [collectedTexts, setCollectedTexts] = useState([]);
  const [encounteredScholars, setEncounteredScholars] = useState([]);

  // Current turn state
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [lastDelta, setLastDelta] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [selectedEventChoice, setSelectedEventChoice] = useState(null);

  // Final
  const [finalResult, setFinalResult] = useState(null);
  const [newAchievements, setNewAchievements] = useState([]);
  const [saveWarning, setSaveWarning] = useState(false);
  const [savedResults, setSavedResults] = useState(() => getResults());

  // A1: 플레이별 세션 시드
  const [gameSessionSeed, setGameSessionSeed] = useState(0);
  // A3: 특수 이벤트 미발동 턴 카운터
  const [turnsSinceSpecial, setTurnsSinceSpecial] = useState(0);
  // A4: 시작 계절 오프셋
  const [seasonOffset, setSeasonOffset] = useState(0);
  // A6: 시대 수식어
  const [eraModifier, setEraModifier] = useState(null);

  // navigate로 인한 hashchange는 무시 (내부 전환), 사용자 직접 URL 입력만 가드
  const navigatingRef = useRef(false);

  const navigate = useCallback((screenName) => {
    navigatingRef.current = true;
    setScreenRaw(screenName);
    const hash = SCREEN_TO_HASH[screenName] || "#/";
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
    // 다음 틱에 플래그 리셋
    setTimeout(() => { navigatingRef.current = false; }, 0);
  }, []);

  useEffect(() => {
    function onHashChange() {
      // 내부 navigate에 의한 변경은 무시
      if (navigatingRef.current) return;

      const hash = window.location.hash || "#/";
      const target = HASH_TO_SCREEN[hash];
      if (!target) { navigate("start"); return; }
      // 사용자가 직접 URL로 guarded screen에 진입 시도 → 조건 미충족이면 차단
      if (target === "raising" && turnHistory.length === 0) {
        navigate("start");
        return;
      }
      if (target === "final" && !finalResult) {
        navigate("start");
        return;
      }
      setScreenRaw(target);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [finalResult, navigate, turnHistory.length]);

  useEffect(() => {
    const hash = SCREEN_TO_HASH[screen];
    if (hash && window.location.hash !== hash) {
      window.location.hash = hash;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const currentEra = useMemo(() => eras[eraIndex] ?? null, [eraIndex]);
  const totalTurnsInEra = currentEra?.turns ?? 0;
  const isLastEra = eraIndex === eras.length - 1;
  const isLastTurnInEra = turnIndex >= totalTurnsInEra - 1;

  // Compute total turn number (across all eras)
  const globalTurnNumber = useMemo(() => {
    let total = 0;
    for (let i = 0; i < eraIndex; i++) total += eras[i].turns;
    return total + turnIndex + 1;
  }, [eraIndex, turnIndex]);

  const totalTurns = gameMeta.totalTurns;

  // Season system (A4: offset 적용)
  const currentSeason = useMemo(() => getSeason(globalTurnNumber, seasonOffset), [globalTurnNumber, seasonOffset]);
  const seasonBonus = useMemo(() => getSeasonBonus(currentSeason?.id), [currentSeason]);

  // Trait system
  const activeTraits = useMemo(() => checkTraits(playerStats), [playerStats]);

  // NPC system - get NPCs for current era
  const currentNpcs = useMemo(
    () => npcData.npcs.filter((n) => n.era === currentEra?.id),
    [currentEra]
  );

  // Get activity info with era overrides (checks both global and era-specific activities)
  function getActivityInfo(activityId) {
    let base = activities.find((a) => a.id === activityId);
    if (!base) {
      // Check era-specific activities
      base = currentEra?.eraActivities?.find((a) => a.id === activityId);
    }
    if (!base) return null;
    const override = currentEra?.activityOverrides?.[activityId];
    return {
      ...base,
      flavorTitle: override?.flavorTitle || base.title,
      flavorText: override?.flavorText || base.description,
      effectiveDelta: getActivityDelta(activityId, currentEra)
    };
  }

  function startGame(name = "") {
    setPlayerName(name.trim());
    setEraIndex(0);
    setTurnIndex(0);
    setPhase("activity-select");

    // A5: 시작 스탯 소폭 변동 — 의술/학식/덕행 중 랜덤 2개에 +1
    const initStats = cloneInitialStats();
    const varKeys = ["medical", "knowledge", "virtue"];
    const shuffled = [...varKeys].sort(() => Math.random() - 0.5);
    initStats[shuffled[0]] += 1;
    initStats[shuffled[1]] += 1;

    setPlayerStats(initStats);
    statsRef.current = initStats;
    setTurnHistory([]);
    turnHistoryRef.current = [];
    setActivityCounts({});
    setSelectedActivity(null);
    setLastDelta(null);
    setCurrentEvent(null);
    setSelectedEventChoice(null);
    setNpcAffinities({});
    setPendingNpcEvent(null);
    setFinalResult(null);
    setNewAchievements([]);
    setSaveWarning(false);
    setSeenEventIds(new Set());
    setLastPressureTitle(null);
    setStaminaSaveUsed(false);
    setCollectedTexts([]);
    setEncounteredScholars([]);

    // A1: 플레이별 랜덤 세션 시드
    setGameSessionSeed(Math.floor(Math.random() * 2 ** 31));
    // A3: 특수 이벤트 카운터 리셋
    setTurnsSinceSpecial(0);
    // A4: 시작 계절 랜덤 오프셋
    setSeasonOffset(Math.floor(Math.random() * 4));
    // A6: 첫 시대 수식어
    setEraModifier(ERA_MODIFIERS[Math.floor(Math.random() * ERA_MODIFIERS.length)]);

    navigate("raising");
  }

  // stamina-save 사용 여부 추적 (이 위치 유지 — 기존 코드와 호환)
  const [staminaSaveUsed, setStaminaSaveUsed] = useState(false);

  function applyTurnDelta(delta) {
    // 명성 보호 특성 적용 (이벤트/보스/압박 상황에서 명성 손실 절반)
    const protectedDelta = applyReputationProtect(delta, activeTraits);
    const newStats = applyDelta(statsRef.current, protectedDelta);

    if (newStats.stamina <= 0) {
      if (hasStaminaSave(activeTraits) && !staminaSaveUsed) {
        newStats.stamina = 3;
        setStaminaSaveUsed(true);
      } else {
        newStats.stamina = 0;
        setPlayerStats(newStats);
        statsRef.current = newStats;
        return { newStats, didDie: true };
      }
    }

    setPlayerStats(newStats);
    statsRef.current = newStats;
    return { newStats, didDie: false };
  }

  function selectActivity(activityId) {
    const delta = { ...getActivityDelta(activityId, currentEra) };

    // Apply trait bonus
    const traitBonus = getTraitBonus(activeTraits, activityId);
    for (const [k, v] of Object.entries(traitBonus)) {
      delta[k] = (delta[k] || 0) + v;
    }

    // Apply season bonus/penalty
    if (seasonBonus) {
      if (seasonBonus.activityId === activityId && seasonBonus.bonus) {
        for (const [k, v] of Object.entries(seasonBonus.bonus)) {
          delta[k] = (delta[k] || 0) + v;
        }
      }
      if (seasonBonus.activityId === null && seasonBonus.penalty) {
        for (const [k, v] of Object.entries(seasonBonus.penalty)) {
          delta[k] = (delta[k] || 0) + v;
        }
      }
    }

    // A6: 시대 수식어 효과 적용
    if (eraModifier) {
      if (eraModifier.deltaAdjust) {
        for (const [k, v] of Object.entries(eraModifier.deltaAdjust)) {
          delta[k] = (delta[k] || 0) + v;
        }
      }
      if (eraModifier.reputationHalf && delta.reputation && delta.reputation > 0) {
        delta.reputation = Math.max(1, Math.floor(delta.reputation / 2));
      }
      if (eraModifier.doubleActivity === activityId) {
        for (const [k, v] of Object.entries(delta)) {
          if (v > 0 && k !== "stamina") delta[k] = v * 2;
        }
      }
    }

    // A2: 스탯 지터 — |delta| >= 2인 항목에 50% 확률로 ±1
    for (const k of Object.keys(delta)) {
      if (Math.abs(delta[k]) >= 2 && Math.random() < 0.5) {
        delta[k] += Math.random() < 0.5 ? 1 : -1;
        // 부호 반전 방지
        if (delta[k] === 0) delta[k] = Math.random() < 0.5 ? 1 : -1;
      }
    }

    const newStats = applyDelta(playerStats, delta);

    // 체력 0 이하 → stamina-save trait가 있으면 1회 생존
    if (newStats.stamina <= 0) {
      if (hasStaminaSave(activeTraits) && !staminaSaveUsed) {
        newStats.stamina = 3;
        setStaminaSaveUsed(true);
      } else {
        newStats.stamina = 0;
        setPlayerStats(newStats);
        statsRef.current = newStats;
        setSelectedActivity(activityId);
        setLastDelta(delta);
        setPhase("dead");
        return;
      }
    }

    setSelectedActivity(activityId);
    setLastDelta(delta);
    setPlayerStats(newStats);
    statsRef.current = newStats;
    setActivityCounts((prev) => ({
      ...prev,
      [activityId]: (prev[activityId] || 0) + 1
    }));

    const newHistoryEntry = {
      eraId: currentEra.id,
      eraTitle: currentEra.title,
      turn: turnIndex + 1,
      activityId,
      activityTitle: (activities.find((a) => a.id === activityId) || currentEra?.eraActivities?.find((a) => a.id === activityId))?.title || activityId,
      delta,
      statsAfter: newStats
    };
    setTurnHistory((prev) => {
      const updated = [...prev, newHistoryEntry];
      turnHistoryRef.current = updated;
      return updated;
    });

    // Update NPC affinities
    setNpcAffinities((prev) => {
      const next = { ...prev };
      for (const npc of currentNpcs) {
        const likeVal = npc.likes?.[activityId] || 0;
        const dislikeVal = npc.dislikes?.[activityId] || 0;
        const change = likeVal + dislikeVal;
        if (change !== 0) {
          next[npc.id] = Math.max(0, (next[npc.id] || 0) + change);
        }
      }
      return next;
    });

    setPhase("activity-result");
  }

  // 전체 미니게임 풀 — 모든 행동에서 랜덤 발동
  const ALL_MINIGAMES = [
    "pulse", "herb", "patient",
    "yinyang", "meridian", "fourdiag", "history", "eightprinciples"
  ];

  function completeMinigame(result) {
    // Apply bonus delta from minigame
    const { label, ...delta } = result;
    const { newStats, didDie } = applyTurnDelta(delta);
    setMinigameType(null);

    // Record minigame result in turn history
    setTurnHistory((prev) => {
      const updated = [...prev];
      const last = { ...updated[updated.length - 1] };
      last.minigameType = minigameType;
      last.minigameDelta = delta;
      last.statsAfter = newStats;
      updated[updated.length - 1] = last;
      turnHistoryRef.current = updated;
      return updated;
    });

    if (didDie) {
      setPhase("dead");
      return;
    }

    // Continue to NPC/event check
    checkNpcAndEvents();
  }

  function proceedAfterResult() {
    if (selectedActivity === "rest") {
      checkNpcAndEvents();
      return;
    }

    // A3: 점진적 발동률 — 기본 15%, 빈 턴마다 +12%
    const specialRate = Math.min(0.7, 0.15 + turnsSinceSpecial * 0.12);

    // 압박 상황 (직전과 같은 것은 제외)
    const pressurePool = pressureEventsData.pressureEvents[selectedActivity];
    if (pressurePool && Math.random() < specialRate) {
      const candidates = pressurePool.filter((p) => p.title !== lastPressureTitle);
      const pool = candidates.length > 0 ? candidates : pressurePool;
      const pick = pool[Math.floor(Math.random() * pool.length)];

      // A7: 압박 이벤트 요구치 ±2 변동
      const modifiedPick = { ...pick, bold: { ...pick.bold } };
      if (modifiedPick.bold.require) {
        modifiedPick.bold.require = { ...modifiedPick.bold.require };
        for (const k of Object.keys(modifiedPick.bold.require)) {
          const variance = Math.floor(Math.random() * 5) - 2; // -2 ~ +2
          modifiedPick.bold.require[k] = Math.max(1, modifiedPick.bold.require[k] + variance);
        }
      }

      setCurrentPressure(modifiedPick);
      setLastPressureTitle(pick.title);
      setTurnsSinceSpecial(0);
      setPhase("pressure");
      return;
    }

    // 미니게임
    if (Math.random() < specialRate) {
      const mgType = ALL_MINIGAMES[Math.floor(Math.random() * ALL_MINIGAMES.length)];
      setMinigameType(mgType);
      setTurnsSinceSpecial(0);
      setPhase("minigame");
      return;
    }

    // 아무것도 발동 안 됨 → 카운터 증가
    setTurnsSinceSpecial((prev) => prev + 1);
    checkNpcAndEvents();
  }

  function completePressure(delta) {
    const { newStats, didDie } = applyTurnDelta(delta);
    setCurrentPressure(null);

    setTurnHistory((prev) => {
      const updated = [...prev];
      const last = { ...updated[updated.length - 1] };
      last.pressureTitle = currentPressure?.title;
      last.pressureDelta = delta;
      last.statsAfter = newStats;
      updated[updated.length - 1] = last;
      turnHistoryRef.current = updated;
      return updated;
    });

    if (didDie) {
      setPhase("dead");
      return;
    }

    checkNpcAndEvents();
  }

  function checkNpcAndEvents() {
    // Check for NPC bonus event first
    for (const npc of currentNpcs) {
      const aff = npcAffinities[npc.id] || 0;
      const threshold = npc.bonusEvent?.threshold;
      if (threshold && aff >= threshold && !turnHistory.some(h => h.npcEventId === npc.id)) {
        setPendingNpcEvent({ npc, event: npc.bonusEvent });
        return;
      }
    }

    // Check for random event (excluding already seen events)
    const event = pickRandomEvent(currentEra, seenEventIds);
    if (event) {
      setCurrentEvent(event);
      setSeenEventIds((prev) => new Set([...prev, event.id]));
      setPhase("event");
    } else {
      advanceTurn();
    }
  }

  function dismissNpcEvent() {
    if (pendingNpcEvent) {
      const { npc, event } = pendingNpcEvent;
      const { newStats, didDie } = applyTurnDelta(event.delta);

      // Mark this NPC event as triggered in history with delta and updated stats
      setTurnHistory((prev) => {
        const updated = [...prev];
        const last = { ...updated[updated.length - 1] };
        last.npcEventId = npc.id;
        last.npcEventTitle = event.title;
        last.npcEventDelta = event.delta;
        last.statsAfter = newStats;
        updated[updated.length - 1] = last;
        turnHistoryRef.current = updated;
        return updated;
      });

      setPendingNpcEvent(null);

      if (didDie) {
        setPhase("dead");
        return;
      }
    }

    // Continue to random event check (excluding already seen)
    const evt = pickRandomEvent(currentEra, seenEventIds);
    if (evt) {
      setCurrentEvent(evt);
      setSeenEventIds((prev) => new Set([...prev, evt.id]));
      setPhase("event");
    } else {
      advanceTurn();
    }
  }

  // 이벤트 선택 — 외부에서 계산된 delta를 받는 버전
  function selectEventChoiceWithDelta(choiceIndex, actualDelta) {
    const choice = currentEvent?.choices?.[choiceIndex];
    if (!choice) return;

    setSelectedEventChoice(choice);
    const { newStats, didDie } = applyTurnDelta(actualDelta);

    setTurnHistory((prev) => {
      const updated = [...prev];
      const last = { ...updated[updated.length - 1] };
      last.eventTitle = currentEvent.title;
      last.eventChoiceText = choice.text;
      last.eventDelta = actualDelta;
      last.statsAfter = newStats;
      updated[updated.length - 1] = last;
      turnHistoryRef.current = updated;
      return updated;
    });

    if (didDie) {
      setPhase("dead");
      return;
    }

    advanceTurn();
  }

  function selectEventChoice(choiceIndex) {
    const choice = currentEvent?.choices?.[choiceIndex];
    if (!choice) return;

    setSelectedEventChoice(choice);
    const { newStats, didDie } = applyTurnDelta(choice.delta);

    setTurnHistory((prev) => {
      const updated = [...prev];
      const last = { ...updated[updated.length - 1] };
      last.eventTitle = currentEvent.title;
      last.eventChoiceText = choice.text;
      last.eventDelta = choice.delta;
      last.statsAfter = newStats;
      updated[updated.length - 1] = last;
      turnHistoryRef.current = updated;
      return updated;
    });

    if (didDie) {
      setPhase("dead");
      return;
    }

    // Brief delay then advance
    advanceTurn();
  }

  function completeBossEvent(delta) {
    const { newStats, didDie } = applyTurnDelta(delta);
    setCurrentBossEvent(null);

    // Record in history
    setTurnHistory((prev) => {
      const updated = [...prev];
      const last = { ...updated[updated.length - 1] };
      last.bossEventTitle = currentBossEvent?.title;
      last.bossEventDelta = delta;
      last.statsAfter = newStats;
      updated[updated.length - 1] = last;
      turnHistoryRef.current = updated;
      return updated;
    });

    if (didDie) {
      setPhase("dead");
      return;
    }

    if (isLastEra) {
      finishGame();
    } else {
      setPhase("era-transition");
    }
  }

  function advanceTurn() {
    setCurrentEvent(null);
    setSelectedEventChoice(null);
    setSelectedActivity(null);
    setLastDelta(null);

    if (isLastTurnInEra) {
      // 시대 마지막 턴 → 보스 이벤트 체크
      const bossEvent = bossEventsData.bossEvents[currentEra?.id];
      if (bossEvent) {
        setCurrentBossEvent(bossEvent);
        setPhase("boss-event");
        return;
      }

      if (isLastEra) {
        finishGame();
      } else {
        setPhase("era-transition");
      }
    } else {
      setTurnIndex((prev) => prev + 1);
      setPhase("activity-select");
    }
  }

  function proceedToNextEra(quizBonus) {
    // Apply era review quiz bonus if any
    if (quizBonus) {
      const newStats = applyDelta(playerStats, quizBonus);
      setPlayerStats(newStats);
      statsRef.current = newStats;
    }

    // Collect medical texts and scholars for completed era
    collectEraAcademicData(currentEra?.id);

    const nextEra = eraIndex + 1;
    setEraIndex(nextEra);
    setTurnIndex(0);
    setSeenEventIds(new Set()); // Reset seen events for new era
    // A6: 새 시대 수식어 랜덤 선택
    setEraModifier(ERA_MODIFIERS[Math.floor(Math.random() * ERA_MODIFIERS.length)]);
    setPhase("activity-select");
  }

  function collectEraAcademicData(eraId) {
    // Auto-collect medical texts related to this era
    const eraTexts = medicalTextsData.texts.filter((t) => t.era === eraId);
    setCollectedTexts((prev) => {
      const existing = new Set(prev);
      const newTexts = eraTexts
        .filter((t) => !existing.has(t.id))
        .map((t) => t.id);
      return [...prev, ...newTexts];
    });

    // Auto-collect scholars from this era
    const eraScholars = scholarLineageData.scholars
      .filter((s) => s.era === eraId)
      .map((s) => s.id);
    setEncounteredScholars((prev) => {
      const existing = new Set(prev);
      const newScholars = eraScholars.filter((id) => !existing.has(id));
      return [...prev, ...newScholars];
    });
  }

  function finishGame() {
    // Bug 3 fix: Collect final era's academic data before evaluating result
    collectEraAcademicData(currentEra?.id);

    // Bug 1 fix: Use refs to read the latest stats/history,
    // since React state may not have flushed yet after setPlayerStats
    const finalStats = statsRef.current;
    const finalHistory = turnHistoryRef.current;

    const result = evaluateResultType(finalStats);
    setFinalResult(result);

    const saved = saveResult({
      playerName,
      finalResult: result,
      scores: finalStats,
      history: finalHistory
    });

    if (!saved._persisted) {
      setSaveWarning(true);
    }

    const allResults = [saved, ...savedResults];
    setSavedResults(allResults);
    const unlocked = checkNewAchievements(saved, allResults);
    setNewAchievements(unlocked);

    navigate("final");
    setPhase("final");
  }

  function restartGame() {
    startGame(playerName);
  }

  function goToStart() { navigate("start"); }
  function goToHowToPlay() { navigate("howToPlay"); }
  function goToHistory() { setSavedResults(getResults()); navigate("history"); }
  function goToAchievements() { navigate("achievements"); }
  function goToCollection() { navigate("collection"); }
  function goToLineage() { navigate("lineage"); }
  function goToGlossary() { navigate("glossary"); }

  function dismissAchievements() { setNewAchievements([]); }

  return {
    // Meta
    gameMeta,
    stats,
    eras,
    activities,

    // Player
    playerName,
    setPlayerName,

    // Navigation
    screen,
    phase,

    // Game state
    eraIndex,
    turnIndex,
    currentEra,
    totalTurnsInEra,
    globalTurnNumber,
    totalTurns,
    isLastEra,
    isLastTurnInEra,
    playerStats,
    turnHistory,
    activityCounts,

    // Session seed (A1)
    gameSessionSeed,

    // Season
    currentSeason,
    seasonBonus,

    // Era modifier (A6)
    eraModifier,

    // NPC
    npcData: npcData.npcs,
    currentNpcs,
    npcAffinities,
    pendingNpcEvent,

    // Traits
    activeTraits,

    // Academic collection
    collectedTexts,
    encounteredScholars,

    // Boss event & Pressure
    currentBossEvent,
    currentPressure,

    // Minigame
    minigameType,

    // Current turn
    selectedActivity,
    lastDelta,
    currentEvent,
    selectedEventChoice,

    // Final
    finalResult,
    newAchievements,
    savedResults,
    saveWarning,

    // Actions
    startGame,
    restartGame,
    selectActivity,
    proceedAfterResult,
    selectEventChoice,
    selectEventChoiceWithDelta,
    proceedToNextEra,
    dismissNpcEvent,
    completeMinigame,
    completeBossEvent,
    completePressure,
    getActivityInfo,

    // Navigation actions
    goToStart,
    goToHowToPlay,
    goToHistory,
    goToAchievements,
    goToCollection,
    goToLineage,
    goToGlossary,
    dismissAchievements
  };
}
