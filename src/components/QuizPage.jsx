import React, { useEffect } from "react";
import { useQuizState } from "../hooks/useQuizState";

const SCORE_LABEL_MAP = {
  medical: { label: "의술", color: "#8b5e3c" },
  knowledge: { label: "학식", color: "#4a6a8f" },
  virtue: { label: "덕행", color: "#3d7a66" },
  reputation: { label: "명성", color: "#8a7232" }
};

export default function QuizPage({ game }) {
  const quiz = useQuizState();

  useEffect(() => {
    quiz.startQuiz();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (quiz.phase === "idle") return null;

  // --- 문제 풀기 ---
  if (quiz.phase === "answering" && quiz.currentQuestion) {
    const q = quiz.currentQuestion;
    return (
      <main className="page quiz-page">
        <div className="quiz-progress">
          <span className="quiz-progress-text">
            문제 {quiz.currentIndex + 1} / {quiz.questions.length}
          </span>
          <div className="quiz-progress-bar">
            <div
              className="quiz-progress-fill"
              style={{ width: `${(quiz.currentIndex / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="quiz-meta">
          <span className="quiz-stage-label">{q.stageTitle}</span>
          <span className="quiz-difficulty-tag">난이도: {q.difficulty}</span>
        </div>

        <h2 className="quiz-question">{q.question}</h2>

        <div className="quiz-options">
          {q.options.map((opt, i) => (
            <button key={i} className="quiz-option" onClick={() => quiz.submitAnswer(i)}>
              {opt}
            </button>
          ))}
        </div>
      </main>
    );
  }

  // --- 해설 ---
  if (quiz.phase === "explanation" && quiz.currentQuestion) {
    const q = quiz.currentQuestion;
    return (
      <main className="page quiz-page">
        <div className="quiz-progress">
          <span className="quiz-progress-text">
            문제 {quiz.currentIndex + 1} / {quiz.questions.length}
          </span>
          <div className="quiz-progress-bar">
            <div
              className="quiz-progress-fill"
              style={{ width: `${((quiz.currentIndex + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className={`quiz-answer-result ${quiz.isCorrect ? "correct" : "wrong"}`}>
          {quiz.isCorrect ? "정답!" : "오답"}
        </div>

        <h2 className="quiz-question">{q.question}</h2>

        <div className="quiz-options">
          {q.options.map((opt, i) => {
            let cls = "quiz-option quiz-option-disabled";
            if (i === q.answerIndex) cls += " correct-highlight";
            if (i === quiz.selectedIndex && i !== q.answerIndex) cls += " wrong-highlight";
            return (
              <button key={i} className={cls} disabled>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="quiz-explanation">
          <p>{q.explanation}</p>
        </div>

        {quiz.isCorrect && q.scoreTags && (
          <div className="quiz-score-tags">
            {q.scoreTags.map((tag) => (
              <span key={tag} className="quiz-score-tag">
                {SCORE_LABEL_MAP[tag]?.label || tag}
              </span>
            ))}
          </div>
        )}

        <button className="btn-primary quiz-next-btn" onClick={quiz.nextQuestion}>
          {quiz.currentIndex < quiz.questions.length - 1 ? "다음 문제" : "결과 보기"}
        </button>
      </main>
    );
  }

  // --- 결과 ---
  if (quiz.phase === "finished") {
    // 시대별 정답률 계산
    const stageStats = {};
    for (const a of quiz.answers) {
      if (!stageStats[a.stageTitle]) stageStats[a.stageTitle] = { correct: 0, total: 0 };
      stageStats[a.stageTitle].total++;
      if (a.isCorrect) stageStats[a.stageTitle].correct++;
    }

    return (
      <main className="page quiz-page">
        <div className="quiz-result-header">
          <h1>퀴즈 결과</h1>
          <p className="quiz-result-score">
            {quiz.correctCount} / {quiz.questions.length}
          </p>
          <p className="quiz-result-pct">
            정답률 {Math.round((quiz.correctCount / quiz.questions.length) * 100)}%
          </p>
        </div>

        <div className="final-scores-grid">
          {Object.entries(SCORE_LABEL_MAP).map(([key, { label, color }]) => (
            <div key={key} className="final-score-item">
              <span className="final-score-number" style={{ color }}>
                {quiz.totalScores[key] || 0}
              </span>
              <span className="final-score-label">{label}</span>
            </div>
          ))}
        </div>

        <section>
          <h2>시대별 정답률</h2>
          <div className="quiz-stage-results">
            {Object.entries(stageStats).map(([title, stat]) => (
              <div key={title} className="quiz-stage-result-item">
                <span className="quiz-stage-result-name">{title}</span>
                <span className="quiz-stage-result-score">
                  {stat.correct} / {stat.total}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="button-group">
          <button className="btn-primary" onClick={quiz.startQuiz}>다시 도전</button>
          <button className="btn-text" onClick={game.goToStart}>홈으로 돌아가기</button>
        </div>
      </main>
    );
  }

  return null;
}
