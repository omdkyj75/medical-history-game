import { useState, useCallback, useMemo } from "react";
import { drawQuizQuestions } from "../utils/drawQuizQuestions";

const INITIAL_SCORES = { "學術名聲": 0, "臨床信賴度": 0, "文獻理解度": 0, "百姓好感度": 0 };

export function useQuizState() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [phase, setPhase] = useState("idle"); // idle | answering | explanation | finished
  const [totalScores, setTotalScores] = useState({ ...INITIAL_SCORES });
  const [selectedIndex, setSelectedIndex] = useState(null);

  const currentQuestion = questions[currentIndex] ?? null;
  const isCorrect = selectedIndex !== null && currentQuestion
    ? selectedIndex === currentQuestion.answerIndex
    : false;

  const correctCount = useMemo(
    () => answers.filter((a) => a.isCorrect).length,
    [answers]
  );

  const startQuiz = useCallback(() => {
    const drawn = drawQuizQuestions();
    setQuestions(drawn);
    setCurrentIndex(0);
    setAnswers([]);
    setPhase("answering");
    setTotalScores({ ...INITIAL_SCORES });
    setSelectedIndex(null);
  }, []);

  const submitAnswer = useCallback((idx) => {
    if (phase !== "answering" || !currentQuestion) return;
    const correct = idx === currentQuestion.answerIndex;
    setSelectedIndex(idx);
    setAnswers((prev) => [...prev, {
      questionId: currentQuestion.id,
      selectedIndex: idx,
      isCorrect: correct,
      stageTitle: currentQuestion.stageTitle
    }]);
    if (correct) {
      setTotalScores((prev) => {
        const next = { ...prev };
        for (const [key, val] of Object.entries(currentQuestion.scoreDelta)) {
          next[key] = (next[key] || 0) + val;
        }
        return next;
      });
    }
    setPhase("explanation");
  }, [phase, currentQuestion]);

  const nextQuestion = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      setPhase("finished");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedIndex(null);
      setPhase("answering");
    }
  }, [currentIndex, questions.length]);

  return {
    questions,
    currentIndex,
    currentQuestion,
    answers,
    phase,
    totalScores,
    selectedIndex,
    isCorrect,
    correctCount,
    startQuiz,
    submitAnswer,
    nextQuestion
  };
}
