import React from "react";

export default function ActivityCard({ activity, onSelect, disabled }) {
  return (
    <button
      className={`raising-activity-card ${disabled ? "disabled" : ""}`}
      onClick={() => !disabled && onSelect(activity.id)}
      disabled={disabled}
    >
      <div className="raising-activity-title">{activity.flavorTitle || activity.title}</div>
      <div className="raising-activity-subtitle">{activity.flavorText || activity.subtitle}</div>
    </button>
  );
}
