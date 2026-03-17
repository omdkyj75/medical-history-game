import { useCallback, useEffect, useMemo, useState } from "react";
import stagesData from "../data/stages.json";
import resultTypesData from "../data/resultTypes.json";
import { evaluateResultType } from "../utils/evaluateResultType";
import { saveResult, getResults } from "../utils/resultStorage";
import { checkNewAchievements } from "../utils/checkAchievements";

const { gameMeta, stages } = stagesData;

const SCREEN_TO_HASH = {
  start: "#/",
  howToPlay: "#/how-to-play",
  stage: "#/stage",
  progress: "#/progress",
  final: "#/final",
  history: "#/history",
  achievements: "#/achievements"
};

const HASH_TO_SCREEN = Object.fromEntries(
  Object.entries(SCREEN_TO_HASH).map(([k, v]) => [v, k])
);

// 게임 상태가 필요해서 hash 직접 진입 불가한 화면
const GUARDED_SCREENS = new Set(["stage", "progress", "final"]);

function screenFromHash() {
  const hash = window.location.hash || "#/";
  const screen = HASH_TO_SCREEN[hash];
  if (!screen || GUARDED_SCREENS.has(screen)) return "start";
  return screen;
}

function cloneInitialScores() {
  return { ...gameMeta.initialScores };
}

function pickRandomChoices(stage, count = 4) {
  const all = [...stage.choices];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, count);
}

export function useGameState() {
  const [playerName, setPlayerName] = useState("");
  const [screen, setScreenRaw] = useState(screenFromHash);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [scores, setScores] = useState(cloneInitialScores);
  const [history, setHistory] = useState([]);
  const [selectedChoiceResult, setSelectedChoiceResult] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [currentChoices, setCurrentChoices] = useState([]);
  const [newAchievements, setNewAchievements] = useState([]);
  const [savedResults, setSavedResults] = useState(() => getResults());

  const navigate = useCallback((screenName) => {
    setScreenRaw(screenName);
    const hash = SCREEN_TO_HASH[screenName] || "#/";
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  }, []);

  // 뒤로가기/앞으로가기 지원
  useEffect(() => {
    function onHashChange() {
      const hash = window.location.hash || "#/";
      const target = HASH_TO_SCREEN[hash];
      if (!target) {
        navigate("start");
        return;
      }
      setScreenRaw(target);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [navigate]);

  // 초기 hash 동기화
  useEffect(() => {
    const hash = SCREEN_TO_HASH[screen];
    if (hash && window.location.hash !== hash) {
      window.location.hash = hash;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const currentStage = useMemo(() => {
    return stages[currentStageIndex] ?? null;
  }, [currentStageIndex]);

  const isLastStage = currentStageIndex === stages.length - 1;

  function pickRandomEvent(stage) {
    const events = stage?.events;
    if (!events || events.length === 0) return null;
    // 50% 확률로 이벤트 미출현
    if (Math.random() < 0.5) return null;
    return events[Math.floor(Math.random() * events.length)];
  }

  function startGame(name = "") {
    setPlayerName(name.trim());
    navigate("stage");
    setCurrentStageIndex(0);
    setScores(cloneInitialScores());
    setHistory([]);
    setSelectedChoiceResult(null);
    setIsResultModalOpen(false);
    setFinalResult(null);
    setNewAchievements([]);
    setActiveEvent(pickRandomEvent(stages[0]));
    setCurrentChoices(pickRandomChoices(stages[0]));
  }

  function goToHowToPlay() {
    navigate("howToPlay");
  }

  function goToStart() {
    navigate("start");
  }

  function goToProgress() {
    setIsResultModalOpen(false);
    navigate("progress");
  }

  function goToHistory() {
    setSavedResults(getResults());
    navigate("history");
  }

  function goToAchievements() {
    navigate("achievements");
  }

  function closeProgress() {
    navigate("stage");
  }

  function selectChoice(choice) {
    if (!currentStage || !choice) return;

    // Apply event modifier to delta
    const eventMod = activeEvent?.modifier || {};
    const effectiveDelta = {
      academicReputation: choice.delta.academicReputation + (eventMod.academicReputation || 0),
      clinicalTrust: choice.delta.clinicalTrust + (eventMod.clinicalTrust || 0),
      textUnderstanding: choice.delta.textUnderstanding + (eventMod.textUnderstanding || 0),
      publicFavor: choice.delta.publicFavor + (eventMod.publicFavor || 0)
    };

    const updatedScores = {
      academicReputation: scores.academicReputation + effectiveDelta.academicReputation,
      clinicalTrust: scores.clinicalTrust + effectiveDelta.clinicalTrust,
      textUnderstanding: scores.textUnderstanding + effectiveDelta.textUnderstanding,
      publicFavor: scores.publicFavor + effectiveDelta.publicFavor
    };

    const newHistory = [
      ...history,
      {
        stageId: currentStage.id,
        stageTitle: currentStage.title,
        choiceId: choice.id,
        choiceTitle: choice.title,
        figure: choice.figure,
        book: choice.book,
        concept: choice.concept,
        delta: effectiveDelta,
        baseDelta: choice.delta,
        eventTitle: activeEvent?.title || null,
        eventModifier: activeEvent?.modifier || null,
        resultComment: choice.resultComment
      }
    ];

    setScores(updatedScores);
    setHistory(newHistory);
    setSelectedChoiceResult({
      stageTitle: currentStage.title,
      choiceTitle: choice.title,
      figure: choice.figure,
      book: choice.book,
      concept: choice.concept,
      delta: effectiveDelta,
      baseDelta: choice.delta,
      eventTitle: activeEvent?.title || null,
      eventModifier: activeEvent?.modifier || null,
      resultComment: choice.resultComment
    });
    setIsResultModalOpen(true);

    if (isLastStage) {
      const evaluated = evaluateResultType(updatedScores, resultTypesData);
      setFinalResult(evaluated);

      // 결과 저장
      const saved = saveResult({
        playerName,
        finalResult: evaluated,
        scores: updatedScores,
        history: newHistory
      });

      // 업적 체크
      const allResults = [saved, ...savedResults];
      setSavedResults(allResults);
      const unlocked = checkNewAchievements(saved, allResults);
      setNewAchievements(unlocked);
    }
  }

  function goToNextStage() {
    setIsResultModalOpen(false);

    if (isLastStage) {
      navigate("final");
      return;
    }

    const nextIndex = currentStageIndex + 1;
    setCurrentStageIndex(nextIndex);
    setActiveEvent(pickRandomEvent(stages[nextIndex]));
    setCurrentChoices(pickRandomChoices(stages[nextIndex]));
  }

  function restartGame() {
    startGame(playerName);
  }

  function dismissAchievements() {
    setNewAchievements([]);
  }

  return {
    playerName,
    screen,
    currentStageIndex,
    currentStage,
    scores,
    history,
    selectedChoiceResult,
    isResultModalOpen,
    finalResult,
    isLastStage,
    activeEvent,
    currentChoices,
    newAchievements,
    savedResults,
    gameMeta,
    stages,
    setPlayerName,
    startGame,
    restartGame,
    goToHowToPlay,
    goToStart,
    goToProgress,
    goToHistory,
    goToAchievements,
    closeProgress,
    selectChoice,
    goToNextStage,
    dismissAchievements
  };
}
