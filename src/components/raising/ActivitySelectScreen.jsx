import React, { useMemo } from "react";
import StatPanel from "./StatPanel";
import TurnIndicator from "./TurnIndicator";
import ActivityCard from "./ActivityCard";
import CharacterSprite from "./CharacterSprite";
import SeasonDisplay from "./SeasonDisplay";
import NpcPanel from "./NpcPanel";

function pickActivities(allActivities, seed) {
  const rest = allActivities.find((a) => a.id === "rest");
  const others = allActivities.filter((a) => a.id !== "rest");
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

  const npcLikesMap = useMemo(() => {
    const map = {};
    for (const npc of game.currentNpcs) {
      for (const [actId, val] of Object.entries(npc.likes || {})) {
        if (val > 0) {
          if (!map[actId]) map[actId] = [];
          map[actId].push(npc.name);
        }
      }
    }
    return map;
  }, [game.currentNpcs]);

  const seasonBoostedId = game.seasonBonus?.activityId;

  return (
    <div className="raising-activity-screen" style={
      game.currentSeason?.bgGradient ? { background: game.currentSeason.bgGradient } : undefined
    }>
      {/* 상단: 턴 + 계절 한 줄 */}
      <div className="compact-top-row">
        <TurnIndicator
          eraTitle={era.title}
          turnIndex={game.turnIndex}
          totalTurnsInEra={game.totalTurnsInEra}
          globalTurn={game.globalTurnNumber}
          totalTurns={game.totalTurns}
        />
        <SeasonDisplay season={game.currentSeason} seasonBonus={game.seasonBonus} />
      </div>

      {/* 캐릭터 + 시대 + NPC: 가로 배치 */}
      <div className="compact-info-row">
        <div className="compact-char-mini">
          <CharacterSprite stats={game.playerStats} season={game.currentSeason?.id} />
        </div>
        <div className="compact-info-body">
          <div className="compact-era-learning">{era.learningPoint}</div>
          <div className="raising-era-keywords">
            {era.keywords.slice(0, 4).map((kw) => (
              <span key={kw} className="raising-keyword-tag">{kw}</span>
            ))}
          </div>
          <NpcPanel npcs={game.currentNpcs} affinities={game.npcAffinities} />
        </div>
      </div>

      {staminaLow && (
        <div className="raising-stamina-warning">체력 부족! 휴식을 권장합니다.</div>
      )}

      <div className="raising-prompt">이번 턴에 무엇을 하시겠습니까?</div>

      <div className="raising-activity-grid">
        {activityInfos.map((info) => (
          <ActivityCard
            key={info.id}
            activity={info}
            onSelect={game.selectActivity}
            disabled={false}
            npcLikes={npcLikesMap[info.id]}
            seasonBoosted={info.id === seasonBoostedId}
          />
        ))}
      </div>

      <StatPanel stats={game.playerStats} statConfig={game.stats} />
    </div>
  );
}
