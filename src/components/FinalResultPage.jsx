import React, { useRef, useCallback } from "react";
import ResultCard from "./ResultCard";

const SCORE_LABELS = {
  academicReputation: "학술",
  clinicalTrust: "임상",
  textUnderstanding: "문헌",
  publicFavor: "민생"
};

const SCORE_COLORS = {
  academicReputation: "var(--score-academic)",
  clinicalTrust: "var(--score-clinical)",
  textUnderstanding: "var(--score-text)",
  publicFavor: "var(--score-public)"
};

export default function FinalResultPage({ game }) {
  const { finalResult, scores, history, restartGame, goToStart, goToHistory } = game;
  const cardRef = useRef(null);

  const handleSaveCard = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: "#fffefb",
        useCORS: true
      });
      const link = document.createElement("a");
      link.download = `명의의길_${finalResult.nickname || "결과"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("이미지 저장에 실패했습니다.");
    }
  }, [finalResult]);

  if (!finalResult) return null;

  return (
    <main className="page final-page">
      {/* 상단: 결과 비주얼 */}
      <div className="final-result-header">
        <p className="final-label">당신의 의원 유형은</p>
        <h1 className="final-nickname">{finalResult.nickname || finalResult.title}</h1>
        <p className="final-title">{finalResult.title}</p>
        {finalResult.subtitle && (
          <p className="final-subtitle">{finalResult.subtitle}</p>
        )}
      </div>

      {/* 점수 4개 그리드 */}
      <div className="final-scores-grid">
        {Object.entries(SCORE_LABELS).map(([key, label]) => (
          <div key={key} className="final-score-item">
            <span className="final-score-number" style={{ color: SCORE_COLORS[key] }}>
              {scores[key]}
            </span>
            <span className="final-score-label">{label}</span>
          </div>
        ))}
      </div>

      {/* 설명 */}
      <section>
        <p className="final-long-desc">{finalResult.longDescription}</p>
      </section>

      {/* 닮은 인물 */}
      {finalResult.historicalMatch && (
        <section>
          <h2>닮은 역사 속 인물</h2>
          <div className="match-card">
            <h3>{finalResult.historicalMatch.name}</h3>
            <p>{finalResult.historicalMatch.reason}</p>
          </div>
        </section>
      )}

      {/* 타임라인 */}
      <section>
        <h2>시대별 선택 기록</h2>
        <div className="final-timeline">
          {history.map((item, idx) => (
            <div key={`${idx}-${item.stageId}-${item.choiceId}`} className="timeline-item">
              <div className="timeline-stage">{item.stageTitle}</div>
              <div className="timeline-choice">
                {item.choiceTitle}
                {item.eventTitle && (
                  <span className="timeline-event"> ({item.eventTitle})</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 결과 카드 */}
      <section className="result-card-section">
        <h2>결과 카드</h2>
        <ResultCard
          ref={cardRef}
          result={finalResult}
          scores={scores}
          timestamp={Date.now()}
        />
        <button className="save-card-btn" onClick={handleSaveCard}>
          결과 카드 이미지로 저장
        </button>
      </section>

      {/* 안내 */}
      <section className="final-learning">
        <p>
          이 결과는 정답이 아니라, 당신이 어떤 역사적 선택을 더 중시했는지를 보여 줍니다.
          다시 플레이하면 완전히 다른 유형의 의원이 될 수도 있습니다.
        </p>
      </section>

      {/* 버튼 */}
      <div className="button-group">
        <button onClick={restartGame}>다시 시작</button>
        <button className="btn-text" onClick={goToHistory}>이전 기록 보기</button>
        <button className="btn-text" onClick={goToStart}>처음으로 돌아가기</button>
      </div>
    </main>
  );
}
