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
  medical: "var(--score-medical)",
  knowledge: "var(--score-knowledge)",
  virtue: "var(--score-virtue)",
  stamina: "var(--score-stamina)",
  reputation: "var(--score-reputation)"
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

      {/* 만난 NPC 인연 */}
      {game.currentNpcs !== undefined && (
        <section>
          <h2>당신과 인연을 맺은 인물들</h2>
          <div className="final-npc-grid">
            {(() => {
              const allNpcs = game.eras.flatMap((era) => {
                const npcs = (game.npcData || []).filter((n) => n.era === era.id);
                return npcs.map((npc) => ({
                  ...npc,
                  eraTitle: era.title,
                  affinity: game.npcAffinities[npc.id] || 0
                }));
              }).filter((n) => n.affinity > 0);

              if (allNpcs.length === 0) return <p>인연을 맺은 인물이 없습니다.</p>;

              return allNpcs.sort((a, b) => b.affinity - a.affinity).map((npc) => (
                <div key={npc.id} className="final-npc-card">
                  <span className="final-npc-emoji">{npc.emoji}</span>
                  <div className="final-npc-info">
                    <div className="final-npc-name">{npc.name}</div>
                    <div className="final-npc-title">{npc.title}</div>
                    <div className="final-npc-era">{npc.eraTitle}</div>
                    <div className="final-npc-affinity">호감도: {"★".repeat(Math.min(5, npc.affinity))}</div>
                  </div>
                </div>
              ));
            })()}
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

      {/* 회고: 당신을 만든 3개의 순간 */}
      <section className="review-section">
        <h2>당신을 만든 순간들</h2>
        {(() => {
          // 스탯 변화가 가장 컸던 3턴
          const turnsWithImpact = turnHistory.map((h, idx) => {
            const totalDelta = Object.values(h.delta || {}).reduce((sum, v) => sum + Math.abs(v), 0);
            return { ...h, idx, totalDelta };
          }).sort((a, b) => b.totalDelta - a.totalDelta).slice(0, 3);

          // 가장 많이 고른 활동
          const activityFreq = {};
          turnHistory.forEach((h) => {
            const key = h.activityTitle || h.activityId;
            activityFreq[key] = (activityFreq[key] || 0) + 1;
          });
          const topActivities = Object.entries(activityFreq)
            .sort((a, b) => b[1] - a[1]).slice(0, 3);

          // 가장 가까운 NPC
          const allNpcs = (game.npcData || []).map((npc) => ({
            ...npc,
            affinity: game.npcAffinities[npc.id] || 0
          })).filter((n) => n.affinity > 0).sort((a, b) => b.affinity - a.affinity);
          const bestNpc = allNpcs[0];

          // 놓친 엔딩 제안
          const scoreKeys = ["medical", "knowledge", "virtue", "reputation"];
          const sorted = [...scoreKeys].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
          const weakest = sorted[sorted.length - 1];

          return (
            <div className="review-content">
              <div className="review-moments">
                <h3>결정적 순간 TOP 3</h3>
                {turnsWithImpact.map((t, i) => (
                  <div key={i} className="review-moment-item">
                    <span className="review-moment-num">{i + 1}</span>
                    <div>
                      <strong>{t.eraTitle}</strong> — {t.activityTitle}
                      {t.eventTitle && <span className="timeline-event"> ({t.eventTitle})</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="review-habits">
                <h3>자주 택한 길</h3>
                {topActivities.map(([name, count], i) => (
                  <div key={i} className="review-habit-item">
                    {name} <span className="review-habit-count">{count}회</span>
                  </div>
                ))}
              </div>

              {bestNpc && (
                <div className="review-best-npc">
                  <h3>가장 깊은 인연</h3>
                  <div className="review-npc-card">
                    <span className="review-npc-emoji">{bestNpc.emoji}</span>
                    <div>
                      <strong>{bestNpc.name}</strong>
                      <p>{bestNpc.title}</p>
                      <p>호감도 {"★".repeat(Math.min(5, bestNpc.affinity))}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="review-missed">
                <h3>놓친 가능성</h3>
                <p>
                  {TENDENCY_NAMES[weakest]}을(를) 더 키웠다면 다른 엔딩에 도달했을 수 있습니다.
                  다음 판에는 {TENDENCY_NAMES[weakest]} 중심 플레이를 도전해보세요!
                </p>
              </div>

              {finalResult.reviewKeywords && (
                <div className="review-keywords">
                  <h3>복습 키워드</h3>
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
