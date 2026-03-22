import { useCallback, useEffect, useMemo, useState } from "react";
import gameConfig from "../data/gameConfig.json";
import resultTypesData from "../data/resultTypes.json";
import { saveResult, getResults } from "../utils/resultStorage";
import { checkNewAchievements } from "../utils/checkAchievements";

const { stats, eras, activities, gameMeta } = gameConfig;

const SCREEN_TO_HASH = {
  start: "#/",
  howToPlay: "#/how-to-play",
  raising: "#/raising",
  final: "#/final",
  history: "#/history",
  achievements: "#/achievements",
  quiz: "#/quiz"
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
  const activity = activities.find((a) => a.id === activityId);
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

function pickRandomEvent(era) {
  const events = era?.events;
  if (!events || events.length === 0) return null;

  // Filter by probability
  const candidates = events.filter(
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
  // phases: activity-select, activity-result, event, era-transition, final
  const [phase, setPhase] = useState("activity-select");
  const [playerStats, setPlayerStats] = useState(cloneInitialStats);
  const [turnHistory, setTurnHistory] = useState([]);
  const [activityCounts, setActivityCounts] = useState({});

  // Current turn state
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [lastDelta, setLastDelta] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [selectedEventChoice, setSelectedEventChoice] = useState(null);

  // Final
  const [finalResult, setFinalResult] = useState(null);
  const [newAchievements, setNewAchievements] = useState([]);
  const [savedResults, setSavedResults] = useState(() => getResults());

  const navigate = useCallback((screenName) => {
    setScreenRaw(screenName);
    const hash = SCREEN_TO_HASH[screenName] || "#/";
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  }, []);

  useEffect(() => {
    function onHashChange() {
      const hash = window.location.hash || "#/";
      const target = HASH_TO_SCREEN[hash];
      if (!target) { navigate("start"); return; }
      setScreenRaw(target);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [navigate]);

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

  // Get activity info with era overrides
  function getActivityInfo(activityId) {
    const base = activities.find((a) => a.id === activityId);
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
    setPlayerStats(cloneInitialStats());
    setTurnHistory([]);
    setActivityCounts({});
    setSelectedActivity(null);
    setLastDelta(null);
    setCurrentEvent(null);
    setSelectedEventChoice(null);
    setFinalResult(null);
    setNewAchievements([]);
    navigate("raising");
  }

  function selectActivity(activityId) {
    // Check stamina warning: if stamina would go below 0
    const delta = getActivityDelta(activityId, currentEra);
    const newStats = applyDelta(playerStats, delta);

    setSelectedActivity(activityId);
    setLastDelta(delta);
    setPlayerStats(newStats);
    setActivityCounts((prev) => ({
      ...prev,
      [activityId]: (prev[activityId] || 0) + 1
    }));

    setTurnHistory((prev) => [
      ...prev,
      {
        eraId: currentEra.id,
        eraTitle: currentEra.title,
        turn: turnIndex + 1,
        activityId,
        activityTitle: activities.find((a) => a.id === activityId)?.title || activityId,
        delta,
        statsAfter: newStats
      }
    ]);

    setPhase("activity-result");
  }

  function proceedAfterResult() {
    // Check for random event
    const event = pickRandomEvent(currentEra);
    if (event) {
      setCurrentEvent(event);
      setPhase("event");
    } else {
      advanceTurn();
    }
  }

  function selectEventChoice(choiceIndex) {
    const choice = currentEvent?.choices?.[choiceIndex];
    if (!choice) return;

    setSelectedEventChoice(choice);
    const newStats = applyDelta(playerStats, choice.delta);
    setPlayerStats(newStats);

    // Update last history entry with event info
    setTurnHistory((prev) => {
      const updated = [...prev];
      const last = { ...updated[updated.length - 1] };
      last.eventTitle = currentEvent.title;
      last.eventChoiceText = choice.text;
      last.eventDelta = choice.delta;
      last.statsAfter = newStats;
      updated[updated.length - 1] = last;
      return updated;
    });

    // Brief delay then advance
    advanceTurn();
  }

  function advanceTurn() {
    setCurrentEvent(null);
    setSelectedEventChoice(null);
    setSelectedActivity(null);
    setLastDelta(null);

    if (isLastTurnInEra) {
      if (isLastEra) {
        // Game over — evaluate result
        finishGame();
      } else {
        setPhase("era-transition");
      }
    } else {
      setTurnIndex((prev) => prev + 1);
      setPhase("activity-select");
    }
  }

  function proceedToNextEra() {
    const nextEra = eraIndex + 1;
    setEraIndex(nextEra);
    setTurnIndex(0);
    setPhase("activity-select");
  }

  function finishGame() {
    const result = evaluateResultType(playerStats);
    setFinalResult(result);

    const saved = saveResult({
      playerName,
      finalResult: result,
      scores: playerStats,
      history: turnHistory
    });

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
  function goToQuiz() { navigate("quiz"); }
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

    // Current turn
    selectedActivity,
    lastDelta,
    currentEvent,
    selectedEventChoice,

    // Final
    finalResult,
    newAchievements,
    savedResults,

    // Actions
    startGame,
    restartGame,
    selectActivity,
    proceedAfterResult,
    selectEventChoice,
    proceedToNextEra,
    getActivityInfo,

    // Navigation actions
    goToStart,
    goToHowToPlay,
    goToHistory,
    goToAchievements,
    goToQuiz,
    dismissAchievements
  };
}
