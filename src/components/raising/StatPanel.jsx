import React from "react";

export default function StatPanel({ stats, statConfig, previewDelta }) {
  const keys = statConfig.keys;

  return (
    <div className="raising-stat-panel">
      {keys.map((key) => {
        const value = stats[key] ?? 0;
        const max = statConfig.max[key] ?? 100;
        const color = `var(--score-${key}, #888)`;
        const label = statConfig.labels[key] ?? key;
        const pct = Math.min(100, (value / max) * 100);
        const delta = previewDelta?.[key];
        const previewPct = delta
          ? Math.min(100, (Math.max(0, value + delta) / max) * 100)
          : null;

        return (
          <div className="raising-stat-row" key={key}>
            <span className="raising-stat-label">{label}</span>
            <div className="raising-stat-bar-track">
              {previewPct !== null && previewPct !== pct && (
                <div
                  className={`raising-stat-bar-preview ${delta > 0 ? "positive" : "negative"}`}
                  style={{
                    width: `${Math.max(pct, previewPct)}%`,
                    left: delta < 0 ? `${previewPct}%` : `${pct}%`,
                    backgroundColor: delta > 0 ? color : "#e74c3c"
                  }}
                />
              )}
              <div
                className="raising-stat-bar-fill"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
            <span className="raising-stat-value">
              {key === "stamina" ? `${value}/${max}` : value}
              {delta != null && delta !== 0 && (
                <span className={`raising-stat-delta ${delta > 0 ? "positive" : "negative"}`}>
                  {delta > 0 ? `+${delta}` : delta}
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
