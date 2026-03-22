import React, { useMemo } from "react";
import StatPanel from "./StatPanel";
import TurnIndicator from "./TurnIndicator";
import ActivityCard from "./ActivityCard";
import CharacterSprite from "./CharacterSprite";
import SeasonDisplay from "./SeasonDisplay";
import NpcPanel from "./NpcPanel";

function pickActivities(allActivities, eraActivities, seed) {
  const rest = allActivities.find((a) => a.id === "rest");
  const globalOthers = allActivities.filter((a) => a.id !== "rest");
  const combined = [...globalOthers, ...(eraActivities || [])];

  // Seeded PRNG (mulberry32) for reproducible but well-distributed shuffles
  let s = seed | 0;
  function rand() {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  const shuffled = [...combined];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return [...shuffled.slice(0, 4), rest];
}

export default function ActivitySelectScreen({ game }) {
  const era = game.currentEra;
  if (!era) return null;

  const eraActivities = era.eraActivities || [];
  const seed = game.globalTurnNumber * 2654435761 + game.eraIndex * 40503 + game.turnIndex * 12289;
  const availableActivities = useMemo(
    () => pickActivities(game.activities, eraActivities, seed),
    [game.activities, eraActivities, seed]
  );

  const activityInfos = availableActivities.map((a) => game.getActivityInfo(a.id));
  const staminaLow = game.playerStats.stamina <= 2;

  // NPC likes per activity
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

  // Season boosted activity
  const seasonBoostedId = game.seasonBonus?.activityId;

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
