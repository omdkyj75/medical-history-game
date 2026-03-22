import React from "react";

export default function StartPage({ game }) {
  const { gameMeta, eras } = game;
  return (
    <main className="page start-page">
      <h1>{gameMeta.title}</h1>
      <p className="start-subtitle">{gameMeta.subtitle}</p>
      <p className="start-desc">{gameMeta.description}</p>

      <div className="start-timeline">
        {eras.map((era) => (
          <div key={era.id} className="start-timeline-dot">
            <div className="start-timeline-line" />
            <span>{era.title.replace(/\(.*\)/, "").trim()}</span>
          </div>
        ))}
      </div>

      <div className="start-points">
        <span>{gameMeta.totalEras}개 시대</span>
        <span>5가지 능력치</span>
        <span>{gameMeta.totalTurns}턴 육성</span>
      </div>

      <div className="start-actions">
        <button className="btn-primary" onClick={() => game.startGame("")}>
          육성 시뮬레이션 시작
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
