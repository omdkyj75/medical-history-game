import React, { useState } from "react";
import StatPanel from "./StatPanel";
import EraReviewCard from "./EraReviewCard";

export default function EraTransitionScreen({ game }) {
  const era = game.currentEra;
  const nextEra = game.eras[game.eraIndex + 1];
  const transition = era?.transitionScene;
  const [quizBonus, setQuizBonus] = useState(null);
  const [showReview, setShowReview] = useState(true);

  function handleQuizComplete(bonus) {
    setQuizBonus(bonus);
  }

  function handleProceed() {
    game.proceedToNextEra(quizBonus);
  }

  return (
    <div className="raising-era-transition">
      <div className="raising-transition-badge">시대 전환</div>

      <h2 className="raising-transition-era-title">{era?.title} 완료</h2>

      {transition && (
        <>
          <p className="raising-transition-text">{transition.text}</p>
          <div className="raising-transition-note">
            <strong>역사적 의의</strong>
            <p>{transition.historicalNote}</p>
          </div>
        </>
      )}

      {/* 학습 요약 카드 + 퀴즈 */}
      {showReview && (
        <EraReviewCard
          eraId={era?.id}
          onQuizComplete={handleQuizComplete}
        />
      )}

      {quizBonus && (
        <div className="raising-quiz-bonus-notice">
          ✨ 퀴즈 보너스: 학식 +{quizBonus.knowledge || 0}
        </div>
      )}

      <StatPanel stats={game.playerStats} statConfig={game.stats} />

      {nextEra && (
        <div className="raising-transition-next">
          <div className="raising-transition-next-label">다음 시대</div>
          <h3>{nextEra.title}</h3>
          <p className="raising-transition-next-period">{nextEra.period}</p>
          <p>{nextEra.learningPoint}</p>
        </div>
      )}

      <button className="btn-primary" onClick={handleProceed}>
        {nextEra ? `${nextEra.title}(으)로 진입` : "결과 확인"}
      </button>
    </div>
  );
}
