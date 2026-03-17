import React from "react";
import { getAllAchievements } from "../utils/checkAchievements";

export default function AchievementPage({ game }) {
  const { goToStart } = game;
  const achievements = getAllAchievements();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <main className="page achievement-page">
      <h1>업적</h1>
      <p className="achievement-progress">
        {unlockedCount} / {achievements.length} 달성
      </p>

      <div className="achievement-grid">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={`achievement-card ${a.unlocked ? "unlocked" : "locked"}`}
          >
            <span className="achievement-icon">{a.unlocked ? a.icon : "🔒"}</span>
            <div className="achievement-info">
              <strong>{a.unlocked ? a.title : "???"}</strong>
              <span>{a.unlocked ? a.description : "아직 달성하지 못했습니다"}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="button-group">
        <button onClick={goToStart}>돌아가기</button>
      </div>
    </main>
  );
}
