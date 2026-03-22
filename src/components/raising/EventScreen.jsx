import React from "react";

export default function EventScreen({ game }) {
  const event = game.currentEvent;
  if (!event) return null;

  return (
    <div className="raising-event-screen">
      <div className="raising-event-badge">이벤트 발생!</div>
      <h2 className="raising-event-title">{event.title}</h2>
      <p className="raising-event-description">{event.description}</p>

      <div className="raising-event-choices">
        {event.choices.map((choice, idx) => {
          const deltaEntries = Object.entries(choice.delta).filter(([, v]) => v !== 0);
          return (
            <button
              key={idx}
              className="raising-event-choice-btn"
              onClick={() => game.selectEventChoice(idx)}
            >
              <div className="raising-event-choice-text">{choice.text}</div>
              <div className="raising-event-choice-deltas">
                {deltaEntries.map(([key, val]) => (
                  <span key={key} className={`raising-delta-tag ${val > 0 ? "positive" : "negative"}`}>
                    {key === "medical" ? "의술" :
                     key === "knowledge" ? "학식" :
                     key === "virtue" ? "덕행" :
                     key === "stamina" ? "체력" :
                     key === "reputation" ? "명성" : key}
                    {val > 0 ? `+${val}` : val}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
