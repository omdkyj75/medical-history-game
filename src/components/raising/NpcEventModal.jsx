import React from "react";

const STAT_LABELS = {
  medical: "의술", knowledge: "학식", virtue: "덕행",
  stamina: "체력", reputation: "명성"
};

export default function NpcEventModal({ npc, event, onClose }) {
  if (!npc || !event) return null;

  const deltaEntries = Object.entries(event.delta).filter(([, v]) => v !== 0);

  return (
    <div className="npc-event-overlay" onClick={onClose}>
      <div className="npc-event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="npc-event-emoji">{npc.emoji}</div>
        <div className="npc-event-badge">특별 이벤트</div>
        <h2 className="npc-event-title">{event.title}</h2>
        <p className="npc-event-npc-name">{npc.name}</p>
        <p className="npc-event-desc">{event.description}</p>

        <div className="npc-event-rewards">
          {deltaEntries.map(([key, val]) => (
            <span key={key} className="raising-delta-tag positive">
              {STAT_LABELS[key] || key} +{val}
            </span>
          ))}
        </div>

        <button className="btn-primary" onClick={onClose}>
          감사합니다!
        </button>
      </div>
    </div>
  );
}
