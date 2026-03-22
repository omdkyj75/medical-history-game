import React from "react";

export default function DeadScreen({ game }) {
  const era = game.currentEra;

  return (
    <div className="raising-dead-screen">
      <div className="dead-icon">💀</div>
      <h1 className="dead-title">과로사(過勞死)</h1>
      <p className="dead-subtitle">
        {era?.title}에서 체력이 다하여 쓰러졌습니다.
      </p>
      <p className="dead-message">
        무리한 수련은 오히려 독이 됩니다.<br />
        적절한 휴식도 명의의 덕목입니다.
      </p>

      <div className="dead-stats">
        <div>의술 {game.playerStats.medical}</div>
        <div>학식 {game.playerStats.knowledge}</div>
        <div>덕행 {game.playerStats.virtue}</div>
        <div>명성 {game.playerStats.reputation}</div>
        <div>진행 턴 {game.globalTurnNumber} / {game.totalTurns}</div>
      </div>

      <div className="dead-actions">
        <button className="btn-primary" onClick={game.restartGame}>
          다시 시작
        </button>
        <button className="btn-text" onClick={game.goToStart}>
          처음으로
        </button>
      </div>
    </div>
  );
}
