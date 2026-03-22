import React, { useState } from "react";
import StatPanel from "./StatPanel";
import TurnIndicator from "./TurnIndicator";
import ActivityCard from "./ActivityCard";

export default function ActivitySelectScreen({ game }) {
  const [previewDelta, setPreviewDelta] = useState(null);

  const era = game.currentEra;
  if (!era) return null;

  const activityInfos = game.activities.map((a) => game.getActivityInfo(a.id));

  const staminaLow = game.playerStats.stamina <= 2;

  return (
    <div className="raising-activity-screen">
      <TurnIndicator
        eraTitle={era.title}
        turnIndex={game.turnIndex}
        totalTurnsInEra={game.totalTurnsInEra}
        globalTurn={game.globalTurnNumber}
        totalTurns={game.totalTurns}
      />

      <div className="raising-era-info">
        <div className="raising-era-period">{era.period}</div>
        <p className="raising-era-learning">{era.learningPoint}</p>
        <div className="raising-era-keywords">
          {era.keywords.map((kw) => (
            <span key={kw} className="raising-keyword-tag">{kw}</span>
          ))}
        </div>
      </div>

      {staminaLow && (
        <div className="raising-stamina-warning">
          체력이 부족합니다! 휴식을 취하는 것이 좋겠습니다.
        </div>
      )}

      <StatPanel
        stats={game.playerStats}
        statConfig={game.stats}
        previewDelta={previewDelta}
      />

      <div className="raising-prompt">이번 턴에 무엇을 하시겠습니까?</div>

      <div className="raising-activity-grid">
        {activityInfos.map((info) => (
          <ActivityCard
            key={info.id}
            activity={info}
            onSelect={game.selectActivity}
            onHover={(delta) => setPreviewDelta(delta)}
            onLeave={() => setPreviewDelta(null)}
            disabled={false}
          />
        ))}
      </div>
    </div>
  );
}
