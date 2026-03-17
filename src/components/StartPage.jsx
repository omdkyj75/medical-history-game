import React from "react";

const ERAS = ["춘추전국", "진한", "수당", "송", "금원", "명청민국", "조선"];

export default function StartPage({ game }) {
  const { gameMeta } = game;
  return (
    <main className="page start-page">
      <h1>{gameMeta.title}</h1>
      <p className="start-subtitle">{gameMeta.subtitle}</p>
      <p className="start-desc">{gameMeta.description}</p>

      <div className="start-timeline">
        {ERAS.map((era, i) => (
          <div key={era} className="start-timeline-dot">
            <div className="start-timeline-line" />
            <span>{era}</span>
          </div>
        ))}
      </div>

      <div className="start-points">
        <span>7개 시대</span>
        <span>4가지 성향</span>
        <span>당신만의 의원</span>
      </div>

      <div className="start-actions">
        <button className="btn-primary" onClick={() => game.startGame("")}>
          시작하기
        </button>
        <button className="btn-quiz" onClick={game.goToQuiz}>
          퀴즈 도전
          <span className="btn-quiz-desc">7시대 × 4문제, 총 28문제</span>
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
