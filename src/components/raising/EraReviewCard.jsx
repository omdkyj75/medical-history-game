import React, { useState, useRef } from "react";
import quizData from "../../data/eraReviewQuiz.json";

export default function EraReviewCard({ eraId, onQuizComplete }) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const correctRef = useRef(0);
  const [quizDone, setQuizDone] = useState(false);
  const [finalCorrect, setFinalCorrect] = useState(0);

  const review = quizData.eraReviews.find((r) => r.eraId === eraId);
  if (!review) return null;

  const questions = review.quizQuestions.slice(0, 2);

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === questions[currentQ].answerIndex) {
      correctRef.current += 1;
    }
  };

  const handleNext = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const total = correctRef.current;
      setFinalCorrect(total);
      setQuizDone(true);
      if (onQuizComplete) {
        onQuizComplete({ knowledge: total * 2 });
      }
    }
  };

  return (
    <div className="era-review-card">
      <div className="era-review-badge">시대별 학습 요약</div>
      <h3 className="era-review-title">{review.title}</h3>
      <p className="era-review-summary">{review.summary}</p>

      <ul className="era-review-keypoints">
        {review.keyPoints.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>

      {!showQuiz && !quizDone && (
        <button className="btn-primary" onClick={() => setShowQuiz(true)}>
          학습 퀴즈 도전
        </button>
      )}

      {showQuiz && !quizDone && (
        <div className="era-review-quiz">
          <div className="era-review-quiz-progress">
            문제 {currentQ + 1} / {questions.length}
          </div>
          <p className="era-review-quiz-question">{questions[currentQ].question}</p>

          <div className="era-review-quiz-options">
            {questions[currentQ].options.map((opt, i) => {
              let optClass = "era-review-quiz-option";
              if (selectedAnswer !== null) {
                if (i === questions[currentQ].answerIndex) {
                  optClass += " correct";
                } else if (i === selectedAnswer) {
                  optClass += " wrong";
                }
              }
              return (
                <button
                  key={i}
                  className={optClass}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedAnswer !== null}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="era-review-quiz-explanation">
              <p>
                {selectedAnswer === questions[currentQ].answerIndex
                  ? "정답입니다!"
                  : "오답입니다."}
              </p>
              <p>{questions[currentQ].explanation}</p>
              <button className="btn-secondary" onClick={handleNext}>
                {currentQ + 1 < questions.length ? "다음 문제" : "결과 확인"}
              </button>
            </div>
          )}
        </div>
      )}

      {quizDone && (
        <div className="era-review-quiz-result">
          <p className="era-review-quiz-result-text">
            {questions.length}문제 중 {finalCorrect}개 정답!
          </p>
          <span className="raising-delta-tag positive">
            학식 +{finalCorrect * 2}
          </span>
        </div>
      )}
    </div>
  );
}
