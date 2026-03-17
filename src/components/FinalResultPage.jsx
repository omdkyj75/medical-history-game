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

const TENDENCY_NAMES = {
  academicReputation: "이론 탐구",
  clinicalTrust: "현장 임상",
  textUnderstanding: "문헌 탐독",
  publicFavor: "백성 구휼"
};

export default function FinalResultPage({ game }) {
  const { finalResult, scores, history, stages, gameMeta, restartGame, goToStart, goToHistory } = game;
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

      {/* 복습 섹션 */}
      <section className="review-section">
        <h2>학습 복습</h2>
        {(() => {
          const topKey = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
          const topStage = history.reduce((best, item) => {
            const delta = item.delta?.[topKey] || 0;
            return delta > (best.delta || 0) ? { title: item.stageTitle, delta } : best;
          }, { title: "", delta: 0 });
          return (
            <div className="review-content">
              <p>당신은 <strong>{TENDENCY_NAMES[topKey]}</strong>을(를) 가장 자주 택했습니다.</p>
              {topStage.title && (
                <p>특히 <strong>{topStage.title}</strong> 단계의 선택이 이 성향을 강화했습니다.</p>
              )}
              {finalResult.reviewKeywords && (
                <div className="review-keywords">
                  <p className="review-keywords-label">복습 키워드</p>
                  <div className="review-keywords-list">
                    {finalResult.reviewKeywords.map((kw) => (
                      <span key={kw} className="review-keyword-tag">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </section>

      {/* 토론 질문 */}
      {gameMeta?.discussionQuestions && (
        <section className="discussion-section">
          <h2>수업에서 함께 이야기해 보세요</h2>
          <ul className="discussion-list">
            {gameMeta.discussionQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 안내 · 오해 방지 */}
      <section className="final-learning">
        <p>
          이 결과는 정답이 아니라, 당신이 어떤 역사적 선택을 더 중시했는지를 보여 줍니다.
          다시 플레이하면 완전히 다른 유형의 의원이 될 수도 있습니다.
        </p>
        <p className="disclaimer-text">
          이 게임의 선택은 역사적 경향을 학습하기 위한 단순화된 구성입니다.
          실제 의학사는 여러 사조와 지역, 문헌이 복합적으로 전개되었습니다.
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
