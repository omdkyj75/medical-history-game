import React, { useRef, useCallback } from "react";
import ResultCard from "./ResultCard";

const SCORE_LABELS = {
  medical: "의술",
  knowledge: "학식",
  virtue: "덕행",
  stamina: "체력",
  reputation: "명성"
};

const SCORE_COLORS = {
  medical: "#8b5e3c",
  knowledge: "#4a6a8f",
  virtue: "#3d7a66",
  stamina: "#b85c38",
  reputation: "#8a7232"
};

const TENDENCY_NAMES = {
  medical: "의술 수련",
  knowledge: "경전 탐구",
  virtue: "덕행 실천",
  stamina: "체력 관리",
  reputation: "명성 쌓기"
};

export default function FinalResultPage({ game }) {
  const { finalResult, playerStats, turnHistory, gameMeta, restartGame, goToStart, goToHistory } = game;
  const scores = playerStats;
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
      link.download = `한의사메이커_${finalResult.nickname || "결과"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("이미지 저장에 실패했습니다.");
    }
  }, [finalResult]);

  if (!finalResult) return null;

  return (
    <main className="page final-page">
      <nav className="page-top-nav">
        <button className="btn-home" onClick={goToStart}>홈</button>
      </nav>

      <div className="final-result-header">
        <p className="final-label">당신의 의원 유형은</p>
        <h1 className="final-nickname">{finalResult.nickname || finalResult.title}</h1>
        <p className="final-title">{finalResult.title}</p>
        {finalResult.subtitle && (
          <p className="final-subtitle">{finalResult.subtitle}</p>
        )}
      </div>

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

      <section>
        <p className="final-long-desc">{finalResult.longDescription}</p>
      </section>

      {finalResult.historicalMatch && (
        <section>
          <h2>닮은 역사 속 인물</h2>
          <div className="match-card">
            <h3>{finalResult.historicalMatch.name}</h3>
            <p>{finalResult.historicalMatch.reason}</p>
          </div>
        </section>
      )}

      <section>
        <h2>턴별 행동 기록</h2>
        <div className="final-timeline">
          {turnHistory.map((item, idx) => (
            <div key={idx} className="timeline-item">
              <div className="timeline-stage">{item.eraTitle}</div>
              <div className="timeline-choice">
                {item.activityTitle}
                {item.eventTitle && (
                  <span className="timeline-event"> ({item.eventTitle})</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

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

      <section className="review-section">
        <h2>학습 복습</h2>
        {(() => {
          const scoreKeys = ["medical", "knowledge", "virtue", "reputation"];
          const topKey = scoreKeys.sort((a, b) => (scores[b] || 0) - (scores[a] || 0))[0];
          return (
            <div className="review-content">
              <p>당신은 <strong>{TENDENCY_NAMES[topKey]}</strong>을(를) 가장 중시했습니다.</p>
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

      <div className="button-group">
        <button onClick={restartGame}>다시 시작</button>
        <button className="btn-text" onClick={goToHistory}>이전 기록 보기</button>
        <button className="btn-text" onClick={goToStart}>처음으로 돌아가기</button>
      </div>
    </main>
  );
}
