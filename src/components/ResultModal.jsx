import React from "react";

const TENDENCY_LABELS = {
  academicReputation: "이론 탐구",
  clinicalTrust: "현장 임상",
  textUnderstanding: "문헌 탐독",
  publicFavor: "백성 구휼"
};

const SCORE_SHORT = {
  academicReputation: "학술",
  clinicalTrust: "임상",
  textUnderstanding: "문헌",
  publicFavor: "민생"
};

export default function ResultModal({ result, onNext, onViewProgress, gameMeta }) {
  if (!result) return null;

  const delta = result.delta;
  const entries = Object.entries(delta);
  const gains = entries.filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  const losses = entries.filter(([, v]) => v < 0);
  const topGain = gains[0];

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* 총평 한 줄 */}
        {topGain && (
          <p className="result-summary-line">
            이번 시대에서 당신은 <strong>{TENDENCY_LABELS[topGain[0]]}</strong>의 길을 택했습니다.
          </p>
        )}

        {/* 선택 요약 */}
        <div className="result-choice-summary">
          <p className="result-choice-title">{result.choiceTitle}</p>
          <div className="result-meta">
            <span>{result.figure}</span>
            <span>{result.book}</span>
            <span>{result.concept}</span>
          </div>
        </div>

        {/* 점수 변화 (숫자 강조) */}
        <div className="delta-scores">
          {entries.map(([key, val]) => (
            <div key={key} className="delta-score-item">
              <span className={`delta-score-value ${val > 0 ? "positive" : val < 0 ? "negative" : "zero"}`}>
                {val > 0 ? `+${val}` : val === 0 ? "0" : val}
              </span>
              <span className="delta-score-label">{SCORE_SHORT[key]}</span>
            </div>
          ))}
        </div>

        {/* tradeoff */}
        {losses.length > 0 && (
          <p className="tradeoff-msg">
            선택에는 대가가 따릅니다 — {losses.map(([k]) => TENDENCY_LABELS[k]).join(", ")} 성향이 약해졌습니다.
          </p>
        )}

        {/* 이벤트 효과 (인라인 노트) */}
        {result.eventTitle && (
          <p className="event-note">
            시대 변수: {result.eventTitle}
            {result.eventModifier && Object.entries(result.eventModifier).map(([key, val]) => (
              <span key={key}> ({SCORE_SHORT[key]} +{val})</span>
            ))}
          </p>
        )}

        {/* 해설 */}
        <p className="commentary-text">{result.resultComment}</p>

        {/* 의학사적 의미 */}
        {result.historicalSignificance && (
          <p className="historical-significance">{result.historicalSignificance}</p>
        )}

        {/* 버튼 */}
        <div className="button-group">
          <button onClick={onNext}>다음 시대로</button>
          <button className="btn-text" onClick={onViewProgress}>성장 리포트 보기 →</button>
        </div>
      </div>
    </div>
  );
}
