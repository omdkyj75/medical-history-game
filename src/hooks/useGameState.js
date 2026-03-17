import { useMemo, useState } from "react";
import stagesData from "../data/stages.json";
import resultTypesData from "../data/resultTypes.json";
import { evaluateResultType } from "../utils/evaluateResultType";

const { gameMeta, stages } = stagesData;

function cloneInitialScores() {
  return { ...gameMeta.initialScores };
}

export function useGameState() {
  const [playerName, setPlayerName] = useState("");
  const [screen, setScreen] = useState("start");
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [scores, setScores] = useState(cloneInitialScores);
  const [history, setHistory] = useState([]);
  const [selectedChoiceResult, setSelectedChoiceResult] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [finalResult, setFinalResult] = useState(null);

  const currentStage = useMemo(() => {
    return stages[currentStageIndex] ?? null;
  }, [currentStageIndex]);

  const isLastStage = currentStageIndex === stages.length - 1;

  function startGame(name = "") {
    setPlayerName(name.trim());
    setScreen("stage");
    setCurrentStageIndex(0);
    setScores(cloneInitialScores());
    setHistory([]);
    setSelectedChoiceResult(null);
    setIsResultModalOpen(false);
    setFinalResult(null);
  }

  function goToHowToPlay() {
    setScreen("howToPlay");
  }

  function goToStart() {
    setScreen("start");
  }

  function goToProgress() {
    setIsResultModalOpen(false);
    setScreen("progress");
  }

  function closeProgress() {
    setScreen("stage");
  }

  function selectChoice(choice) {
    if (!currentStage || !choice) return;

    const updatedScores = {
      academicReputation:
        scores.academicReputation + choice.delta.academicReputation,
      clinicalTrust: scores.clinicalTrust + choice.delta.clinicalTrust,
      textUnderstanding:
        scores.textUnderstanding + choice.delta.textUnderstanding,
      publicFavor: scores.publicFavor + choice.delta.publicFavor
    };

    const historyEntry = {
      stageId: currentStage.id,
      stageTitle: currentStage.title,
      choiceId: choice.id,
      choiceTitle: choice.title,
      figure: choice.figure,
      book: choice.book,
      concept: choice.concept,
      delta: choice.delta,
      resultComment: choice.resultComment
    };

    setScores(updatedScores);
    setHistory((prev) => [...prev, historyEntry]);
    setSelectedChoiceResult({
      stageTitle: currentStage.title,
      choiceTitle: choice.title,
      figure: choice.figure,
      book: choice.book,
      concept: choice.concept,
      delta: choice.delta,
      resultComment: choice.resultComment
    });
    setIsResultModalOpen(true);

    if (isLastStage) {
      const evaluated = evaluateResultType(updatedScores, resultTypesData);
      setFinalResult(evaluated);
    }
  }

  function goToNextStage() {
    setIsResultModalOpen(false);

    if (isLastStage) {
      setScreen("final");
      return;
    }

    setCurrentStageIndex((prev) => prev + 1);
  }

  function restartGame() {
    startGame(playerName);
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
    gameMeta,
    stages,
    setPlayerName,
    startGame,
    restartGame,
    goToHowToPlay,
    goToStart,
    goToProgress,
    closeProgress,
    selectChoice,
    goToNextStage
  };
}
