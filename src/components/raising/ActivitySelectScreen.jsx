import React, { useMemo } from "react";
import StatPanel from "./StatPanel";
import TurnIndicator from "./TurnIndicator";
import ActivityCard from "./ActivityCard";
import CharacterSprite from "./CharacterSprite";
import SeasonDisplay from "./SeasonDisplay";
import NpcPanel from "./NpcPanel";

// 7개 중 5개를 랜덤 선택 (휴식은 항상 포함)
function pickActivities(allActivities, seed) {
  const rest = allActivities.find((a) => a.id === "rest");
  const others = allActivities.filter((a) => a.id !== "rest");

  // 시드 기반 셔플 (같은 턴에서는 일관성 유지)
  const shuffled = [...others];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(((seed * (i + 1) * 9301 + 49297) % 233280) / 233280 * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return [...shuffled.slice(0, 4), rest];
}

export default function ActivitySelectScreen({ game }) {
  const era = game.currentEra;
  if (!era) return null;

  const seed = game.globalTurnNumber * 17 + game.eraIndex * 31;
  const availableActivities = useMemo(
    () => pickActivities(game.activities, seed),
    [game.activities, seed]
  );

  const activityInfos = availableActivities.map((a) => game.getActivityInfo(a.id));
  const staminaLow = game.playerStats.stamina <= 2;

  return (
    <div className="raising-activity-screen" style={
      game.currentSeason?.bgGradient
        ? { background: game.currentSeason.bgGradient }
        : undefined
    }>
      <TurnIndicator
        eraTitle={era.title}
        turnIndex={game.turnIndex}
        totalTurnsInEra={game.totalTurnsInEra}
        globalTurn={game.globalTurnNumber}
        totalTurns={game.totalTurns}
      />

      <SeasonDisplay season={game.currentSeason} seasonBonus={game.seasonBonus} />

      <div className="raising-character-area">
        <CharacterSprite
          stats={game.playerStats}
          season={game.currentSeason?.id}
        />
      </div>

      <div className="raising-era-info">
        <div className="raising-era-period">{era.period}</div>
        <p className="raising-era-learning">{era.learningPoint}</p>
        <div className="raising-era-keywords">
          {era.keywords.map((kw) => (
            <span key={kw} className="raising-keyword-tag">{kw}</span>
          ))}
        </div>
      </div>

      <NpcPanel npcs={game.currentNpcs} affinities={game.npcAffinities} />

      {staminaLow && (
        <div className="raising-stamina-warning">
          체력이 부족합니다! 휴식을 취하는 것이 좋겠습니다.
        </div>
      )}

      <StatPanel stats={game.playerStats} statConfig={game.stats} />

      <div className="raising-prompt">이번 턴에 무엇을 하시겠습니까?</div>

      <div className="raising-activity-grid">
        {activityInfos.map((info) => (
          <ActivityCard
            key={info.id}
            activity={info}
            onSelect={game.selectActivity}
            disabled={false}
          />
        ))}
      </div>
    </div>
  );
}
