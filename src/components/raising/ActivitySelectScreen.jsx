import React, { useMemo } from "react";
import StatPanel from "./StatPanel";
import ActivityCard from "./ActivityCard";
import CharacterSprite from "./CharacterSprite";
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
  const season = game.currentSeason;

  const npcLikesMap = useMemo(() => {
    const map = {};
    for (const npc of game.currentNpcs) {
      for (const [actId, val] of Object.entries(npc.likes || {})) {
        if (val > 0) { if (!map[actId]) map[actId] = []; map[actId].push(npc.name); }
      }
    }
    return map;
  }, [game.currentNpcs]);
  const seasonBoostedId = game.seasonBonus?.activityId;

  return (
    <div className="act-screen" style={season?.bgGradient ? { background: season.bgGradient } : undefined}>
      {/* Row 1: 시대명 + 턴 + 계절 */}
      <div className="act-topbar">
        <div className="act-era-name">{era.title}</div>
        <div className="act-turn-info">
          턴 {game.turnIndex + 1}/{game.totalTurnsInEra} · 전체 {game.globalTurnNumber}/{game.totalTurns}
        </div>
        {season && (
          <div className="act-season" style={{ "--sc": season.color }}>
            {season.name === "봄" ? "春" : season.name === "여름" ? "夏" : season.name === "가을" ? "秋" : "冬"} {season.name}
          </div>
        )}
      </div>

      {/* 진행 바 */}
      <div className="act-progress-track">
        <div className="act-progress-fill" style={{ width: `${(game.globalTurnNumber / game.totalTurns) * 100}%` }} />
      </div>

      {/* Row 2: 캐릭터 + 스탯 + 시대 키워드 */}
      <div className="act-status-row">
        <div className="act-char">
          <CharacterSprite stats={game.playerStats} season={season?.id} />
        </div>
        <div className="act-stats-col">
          <StatPanel stats={game.playerStats} statConfig={game.stats} />
        </div>
        <div className="act-keywords-col">
          {era.keywords.slice(0, 5).map((kw) => (
            <span key={kw} className="raising-keyword-tag">{kw}</span>
          ))}
        </div>
      </div>

      {/* Row 3: NPC */}
      <NpcPanel npcs={game.currentNpcs} affinities={game.npcAffinities} />

      {staminaLow && <div className="raising-stamina-warning">체력 부족! 휴식을 권장합니다.</div>}

      {/* Row 4: 선택지 */}
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
    </div>
  );
}
