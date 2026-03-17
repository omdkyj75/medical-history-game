import React, { forwardRef } from "react";

const SCORE_COLORS = {
  academicReputation: "#8b5e3c",
  clinicalTrust: "#3d7a66",
  textUnderstanding: "#4a6a8f",
  publicFavor: "#8a7232"
};

const SCORE_SHORT = {
  academicReputation: "학술",
  clinicalTrust: "임상",
  textUnderstanding: "문헌",
  publicFavor: "민생"
};

const ResultCard = forwardRef(function ResultCard({ result, scores, timestamp }, ref) {
  if (!result) return null;

  const dateStr = timestamp
    ? new Date(timestamp).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    : "";

  return (
    <div className="result-card" ref={ref}>
      <div className="result-card-header">
        <div className="result-card-game-title">명의(名醫)의 길</div>
      </div>

      <div className="result-card-body">
        <h2 className="result-card-nickname">
          {result.nickname || result.title}
        </h2>
        <p className="result-card-title">{result.title}</p>
        {result.subtitle && (
          <p className="result-card-subtitle">{result.subtitle}</p>
        )}

        <div className="result-card-scores">
          {Object.entries(scores).map(([key, val]) => (
            <div key={key} className="result-card-score-item">
              <span
                className="result-card-score-number"
                style={{ color: SCORE_COLORS[key] }}
              >
                {val}
              </span>
              <span className="result-card-score-label">
                {SCORE_SHORT[key]}
              </span>
            </div>
          ))}
        </div>

        {result.historicalMatch && (
          <div className="result-card-match">
            닮은 인물: <strong>{result.historicalMatch.name}</strong>
          </div>
        )}
      </div>

      <div className="result-card-footer">
        {dateStr && <span>{dateStr}</span>}
      </div>
    </div>
  );
});

export default ResultCard;
