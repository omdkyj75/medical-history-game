import React, { useState } from "react";

const STAT_LABELS = {
  medical: "의술", knowledge: "학식", virtue: "덕행",
  stamina: "체력", reputation: "명성"
};

// 보상 크기에 따른 성공 확률 계산
// 보상 합 2 → 90%, 3 → 80%, 4 → 65%, 5+ → 50%
function calcSuccessRate(delta) {
  const totalPositive = Object.values(delta).filter((v) => v > 0).reduce((s, v) => s + v, 0);
  if (totalPositive <= 2) return 0.9;
  if (totalPositive <= 3) return 0.8;
  if (totalPositive <= 4) return 0.65;
  return 0.5;
}

export default function EventScreen({ game }) {
  const event = game.currentEvent;
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [outcome, setOutcome] = useState(null); // { success, actualDelta }

  if (!event) return null;

  function handleSelect(idx) {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);

    const choice = event.choices[idx];
    const successRate = calcSuccessRate(choice.delta);
    const success = Math.random() < successRate;

    let actualDelta;
    if (success) {
      actualDelta = { ...choice.delta };
    } else {
      // 실패: 긍정 효과 절반, 체력 -1 추가
      actualDelta = {};
      for (const [key, val] of Object.entries(choice.delta)) {
        if (val > 0) {
          actualDelta[key] = Math.max(1, Math.floor(val / 2));
        } else {
          actualDelta[key] = val;
        }
      }
      actualDelta.stamina = (actualDelta.stamina || 0) - 1;
    }

    setOutcome({ success, actualDelta });

    setTimeout(() => {
      game.selectEventChoiceWithDelta(idx, actualDelta);
      setSelectedIdx(null);
      setOutcome(null);
    }, 1800);
  }

  return (
    <div className="raising-event-screen">
      <div className="raising-event-badge">이벤트 발생!</div>
      <h2 className="raising-event-title">{event.title}</h2>
      <p className="raising-event-description">{event.description}</p>

      <div className="raising-event-choices">
        {event.choices.map((choice, idx) => {
          const isSelected = selectedIdx === idx;

          return (
            <button
              key={idx}
              className={`raising-event-choice-btn ${isSelected ? "selected" : ""} ${selectedIdx !== null && !isSelected ? "dimmed" : ""}`}
              onClick={() => handleSelect(idx)}
              disabled={selectedIdx !== null}
            >
              <div className="raising-event-choice-text">{choice.text}</div>
              {isSelected && outcome && (
                <div className="boss-result">
                  <div className={`boss-result-label ${outcome.success ? "success" : "partial"}`}>
                    {outcome.success ? "성공!" : "아쉽지만..."}
                  </div>
                  <div className="raising-event-choice-deltas">
                    {Object.entries(outcome.actualDelta).filter(([, v]) => v !== 0).map(([key, val]) => (
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
