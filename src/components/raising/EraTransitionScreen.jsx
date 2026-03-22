import React from "react";
import StatPanel from "./StatPanel";

export default function EraTransitionScreen({ game }) {
  const era = game.currentEra;
  const nextEra = game.eras[game.eraIndex + 1];
  const transition = era?.transitionScene;

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

      <StatPanel stats={game.playerStats} statConfig={game.stats} />

      {nextEra && (
        <div className="raising-transition-next">
          <div className="raising-transition-next-label">다음 시대</div>
          <h3>{nextEra.title}</h3>
          <p className="raising-transition-next-period">{nextEra.period}</p>
          <p>{nextEra.learningPoint}</p>
        </div>
      )}

      <button className="btn-primary" onClick={game.proceedToNextEra}>
        {nextEra ? `${nextEra.title}(으)로 진입` : "결과 확인"}
      </button>
    </div>
  );
}
