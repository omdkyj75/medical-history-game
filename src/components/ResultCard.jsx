import React, { forwardRef } from "react";

const SCORE_COLORS = {
  medical: "var(--score-medical)",
  knowledge: "var(--score-knowledge)",
  virtue: "var(--score-virtue)",
  stamina: "var(--score-stamina)",
  reputation: "var(--score-reputation)"
};

const SCORE_SHORT = {
  medical: "의술",
  knowledge: "학식",
  virtue: "덕행",
  stamina: "체력",
  reputation: "명성"
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
        <div className="result-card-game-title">한의사메이커</div>
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
