import React from "react";

export default function ActivityCard({ activity, onSelect, onHover, onLeave, disabled }) {
  const delta = activity.effectiveDelta || {};
  const deltaEntries = Object.entries(delta).filter(([, v]) => v !== 0);

  return (
    <button
      className={`raising-activity-card ${disabled ? "disabled" : ""}`}
      onClick={() => !disabled && onSelect(activity.id)}
      onMouseEnter={() => onHover?.(delta)}
      onMouseLeave={() => onLeave?.()}
      disabled={disabled}
    >
      <div className="raising-activity-icon">{activity.icon}</div>
      <div className="raising-activity-title">{activity.flavorTitle || activity.title}</div>
      <div className="raising-activity-subtitle">{activity.flavorText || activity.subtitle}</div>
      <div className="raising-activity-deltas">
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
}
