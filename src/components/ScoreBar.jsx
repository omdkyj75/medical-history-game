import React from "react";

const SCORE_COLORS = {
  academicReputation: "#7a4b2a",
  clinicalTrust: "#2a6b4f",
  textUnderstanding: "#3a5a8c",
  publicFavor: "#8c6b2a"
};

export default function ScoreBar({ scoreKey, label, value, maxScore = 22 }) {
  const pct = Math.min(100, Math.max(0, (value / maxScore) * 100));
  const color = SCORE_COLORS[scoreKey] || "var(--primary)";

  return (
    <div className="score-bar">
      <div className="score-bar-header">
        <span className="score-bar-label">{label}</span>
        <span className="score-bar-value">{value}</span>
      </div>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function ScoreBarGroup({ scores, labels, maxScore = 22 }) {
  const keys = Object.keys(labels);
  return (
    <div className="score-bar-group">
      {keys.map((key) => (
        <ScoreBar
          key={key}
          scoreKey={key}
          label={labels[key]}
          value={scores[key]}
          maxScore={maxScore}
        />
      ))}
    </div>
  );
}
