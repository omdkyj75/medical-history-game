import React from "react";

export default function TurnIndicator({ eraTitle, turnIndex, totalTurnsInEra, globalTurn, totalTurns }) {
  return (
    <div className="raising-turn-indicator">
      <div className="raising-turn-era">{eraTitle}</div>
      <div className="raising-turn-info">
        <span className="raising-turn-local">턴 {turnIndex + 1}/{totalTurnsInEra}</span>
        <span className="raising-turn-global">전체 {globalTurn}/{totalTurns}</span>
      </div>
      <div className="raising-turn-bar-track">
        <div
          className="raising-turn-bar-fill"
          style={{ width: `${(globalTurn / totalTurns) * 100}%` }}
        />
      </div>
    </div>
  );
}
