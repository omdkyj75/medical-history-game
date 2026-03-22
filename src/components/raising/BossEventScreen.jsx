import React, { useState } from "react";

const STAT_LABELS = {
  medical: "의술", knowledge: "학식", virtue: "덕행",
  stamina: "체력", reputation: "명성"
};

export default function BossEventScreen({ game }) {
  const bossEvent = game.currentBossEvent;
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [result, setResult] = useState(null);

  if (!bossEvent) return null;

  function handleSelect(idx) {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);

    const choice = bossEvent.choices[idx];
    const stats = game.playerStats;

    // 조건 충족 여부 체크
    const success = Object.entries(choice.require || {}).every(
      ([key, threshold]) => (stats[key] || 0) >= threshold
    );

    const delta = success ? choice.success : choice.fail;
    setResult({ success, delta });

    // 1.5초 후 스탯 적용 및 진행
    setTimeout(() => {
      game.completeBossEvent(delta);
    }, 2000);
  }

  return (
    <div className="raising-event-screen boss-event-screen">
      <div className="boss-event-badge">시대의 시험</div>
      <h2 className="raising-event-title">{bossEvent.title}</h2>
      <p className="raising-event-description">{bossEvent.description}</p>

      <div className="raising-event-choices">
        {bossEvent.choices.map((choice, idx) => {
          const isSelected = selectedIdx === idx;
          const isOther = selectedIdx !== null && !isSelected;

          return (
            <button
              key={idx}
              className={`raising-event-choice-btn ${isSelected ? "selected" : ""} ${isOther ? "dimmed" : ""}`}
              onClick={() => handleSelect(idx)}
              disabled={selectedIdx !== null}
            >
              <div className="raising-event-choice-text">{choice.text}</div>
              {isSelected && result && (
                <div className="boss-result">
                  <div className={`boss-result-label ${result.success ? "success" : "partial"}`}>
                    {result.success ? "성공!" : "아쉽지만..."}
                  </div>
                  <div className="raising-event-choice-deltas">
                    {Object.entries(result.delta).filter(([, v]) => v !== 0).map(([key, val]) => (
                      <span key={key} className={`raising-delta-tag ${val > 0 ? "positive" : "negative"}`}>
                        {STAT_LABELS[key] || key} {val > 0 ? `+${val}` : val}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
