import React from "react";
import StatPanel from "./StatPanel";

const STAT_LABELS = {
  medical: "의술",
  knowledge: "학식",
  virtue: "덕행",
  stamina: "체력",
  reputation: "명성"
};

export default function ActivityResultScreen({ game }) {
  const activity = game.activities.find((a) => a.id === game.selectedActivity);
  const info = game.getActivityInfo(game.selectedActivity);
  const delta = game.lastDelta || {};
  const deltaEntries = Object.entries(delta).filter(([, v]) => v !== 0);

  return (
    <div className="raising-result-screen">
      <div className="raising-result-header">
        <span className="raising-result-icon">{activity?.icon}</span>
        <h2>{info?.flavorTitle || activity?.title}</h2>
      </div>

      <p className="raising-result-flavor">
        {info?.flavorText || activity?.description}
      </p>

      <div className="raising-result-deltas">
        {deltaEntries.map(([key, val]) => (
          <div key={key} className={`raising-result-delta-item ${val > 0 ? "positive" : "negative"}`}>
            <span className="raising-result-delta-label">{STAT_LABELS[key] || key}</span>
            <span className="raising-result-delta-value">{val > 0 ? `+${val}` : val}</span>
          </div>
        ))}
      </div>

      <StatPanel
        stats={game.playerStats}
        statConfig={game.stats}
      />

      <button className="btn-primary" onClick={game.proceedAfterResult}>
        계속하기
      </button>
    </div>
  );
}
