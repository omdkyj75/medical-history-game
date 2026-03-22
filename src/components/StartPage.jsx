import React from "react";

const ERAS = [
  "상고", "전국", "진한", "위진수당", "송",
  "금원", "명", "청", "고려", "조선"
];

export default function StartPage({ game }) {
  const { gameMeta } = game;
  return (
    <main className="page start-page">
      <h1>{gameMeta.title}</h1>
      <p className="start-subtitle">{gameMeta.subtitle}</p>
      <p className="start-desc">{gameMeta.description}</p>

      <div className="start-timeline">
        {ERAS.map((era) => (
          <div key={era} className="start-timeline-dot">
            <div className="start-timeline-line" />
            <span>{era}</span>
          </div>
        ))}
      </div>

      <div className="start-points">
        <span>10개 시대</span>
        <span>5가지 능력치</span>
        <span>31턴 육성</span>
      </div>

      <div className="start-actions">
        <button className="btn-primary" onClick={() => game.startGame("")}>
          육성 시뮬레이션 시작
        </button>
        <button className="btn-quiz" onClick={game.goToQuiz}>
          퀴즈 도전
          <span className="btn-quiz-desc">10시대 × 4문제, 총 40문제</span>
        </button>
        <div className="start-links">
          <button className="btn-text" onClick={game.goToHowToPlay}>게임 방법</button>
          <button className="btn-text" onClick={game.goToHistory}>플레이 기록</button>
          <button className="btn-text" onClick={game.goToAchievements}>업적</button>
        </div>
      </div>
    </main>
  );
}
