import React from "react";

const SHORT_LABELS = {
  academicReputation: "학술",
  clinicalTrust: "임상",
  textUnderstanding: "문헌",
  publicFavor: "민생"
};

export default function ScorePanel({ scores }) {
  return (
    <div className="score-indicator">
      {Object.entries(SHORT_LABELS).map(([key, label]) => (
        <div key={key} className="score-indicator-item">
          <span className="score-indicator-label">{label}</span>
          <span className="score-indicator-value">{scores[key]}</span>
        </div>
      ))}
    </div>
  );
}
