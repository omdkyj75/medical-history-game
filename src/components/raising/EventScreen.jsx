import React, { useState } from "react";

const STAT_LABELS = {
  medical: "의술", knowledge: "학식", virtue: "덕행",
  stamina: "체력", reputation: "명성"
};

export default function EventScreen({ game }) {
  const event = game.currentEvent;
  const [selectedIdx, setSelectedIdx] = useState(null);

  if (!event) return null;

  function handleSelect(idx) {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    // 잠깐 결과를 보여준 후 진행
    setTimeout(() => {
      game.selectEventChoice(idx);
      setSelectedIdx(null);
    }, 1500);
  }

  return (
    <div className="raising-event-screen">
      <div className="raising-event-badge">이벤트 발생!</div>
      <h2 className="raising-event-title">{event.title}</h2>
      <p className="raising-event-description">{event.description}</p>

      <div className="raising-event-choices">
        {event.choices.map((choice, idx) => {
          const isSelected = selectedIdx === idx;
          const deltaEntries = Object.entries(choice.delta).filter(([, v]) => v !== 0);

          return (
            <button
              key={idx}
              className={`raising-event-choice-btn ${isSelected ? "selected" : ""} ${selectedIdx !== null && !isSelected ? "dimmed" : ""}`}
              onClick={() => handleSelect(idx)}
              disabled={selectedIdx !== null}
            >
              <div className="raising-event-choice-text">{choice.text}</div>
              {isSelected && (
                <div className="raising-event-choice-deltas">
                  {deltaEntries.map(([key, val]) => (
                    <span key={key} className={`raising-delta-tag ${val > 0 ? "positive" : "negative"}`}>
                      {STAT_LABELS[key] || key} {val > 0 ? `+${val}` : val}
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
