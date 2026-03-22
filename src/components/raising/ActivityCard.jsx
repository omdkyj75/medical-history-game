import React from "react";

export default function ActivityCard({ activity, onSelect, disabled, npcLikes, seasonBoosted }) {
  return (
    <button
      className={`raising-activity-card ${disabled ? "disabled" : ""} ${seasonBoosted ? "season-boosted" : ""}`}
      onClick={() => !disabled && onSelect(activity.id)}
      disabled={disabled}
    >
      <div className="activity-card-top">
        <span className="raising-activity-hanzi">{activity.icon}</span>
        {seasonBoosted && <span className="activity-badge season-badge">계절 보너스</span>}
        {npcLikes && npcLikes.length > 0 && (
          <span className="activity-badge npc-badge" title={npcLikes.join(", ")}>
            {npcLikes[0].split("(")[0]} 선호
          </span>
        )}
      </div>
      <div className="raising-activity-title">{activity.flavorTitle || activity.title}</div>
      <div className="raising-activity-subtitle">{activity.flavorText || activity.subtitle}</div>
    </button>
  );
}
