import React, { useMemo } from "react";

// 스탯 기반 외형 해금 조건
const COSMETIC_UNLOCKS = {
  needle:  { stat: "medical",   threshold: 25, label: "침통" },
  bookDeco:{ stat: "knowledge", threshold: 25, label: "책장식" },
  herbBag: { stat: "virtue",    threshold: 25, label: "약초낭" },
  sash:    { stat: "reputation",threshold: 25, label: "비단띠" }
};

function getCharacterState(stats) {
  const { medical, knowledge, virtue, stamina, reputation } = stats;
  const sorted = Object.entries({ medical, knowledge, virtue, reputation })
    .sort((a, b) => b[1] - a[1]);
  const topStat = sorted[0][0];

  // 아이템 (최고 스탯)
  let item = "none";
  if (topStat === "medical") item = "needle";
  else if (topStat === "knowledge") item = "book";
  else if (topStat === "virtue") item = "herb";
  else if (topStat === "reputation") item = "scroll";

  // 표정
  let mood = "normal";
  if (stamina <= 2) mood = "tired";
  else if (stamina >= 15) mood = "happy";
  else if (reputation >= 50) mood = "proud";

  // 레벨 (외형 변화)
  const totalPower = medical + knowledge + virtue + reputation;
  let level = "beginner";
  if (totalPower >= 150) level = "master";
  else if (totalPower >= 80) level = "intermediate";

  // 자세 (C2)
  let pose = "idle";
  if (stamina <= 3) pose = "slouch";
  else if (reputation >= 40) pose = "upright";
  else if (medical >= 30) pose = "forward";
  else if (knowledge >= 30) pose = "reading";

  // 스탯별 복장 색상 포인트 (C1)
  let accentColor = "#5555aa"; // default
  if (topStat === "medical") accentColor = "#cc4444";
  else if (topStat === "knowledge") accentColor = "#4488cc";
  else if (topStat === "virtue") accentColor = "#44aa66";
  else if (topStat === "reputation") accentColor = "#ccaa44";

  // 해금된 장식 (C5)
  const unlocked = {};
  for (const [key, def] of Object.entries(COSMETIC_UNLOCKS)) {
    unlocked[key] = stats[def.stat] >= def.threshold;
  }

  return { item, mood, level, topStat, pose, accentColor, unlocked };
}

export default function CharacterSprite({ stats, animating, season }) {
  const state = useMemo(() => getCharacterState(stats), [stats]);
  const seasonClass = season ? `season-${season}` : "";
  const isLowStamina = stats.stamina <= 3;

  return (
    <div className={`char-sprite-container ${seasonClass}`}>
      <div className={`char-sprite ${state.level} mood-${state.mood} pose-${state.pose} ${animating ? "char-animating" : ""} ${isLowStamina ? "char-low-hp" : ""}`}>

        {/* C3: 시즌 오버레이 소품 */}
        {season === "spring" && <div className="char-season-item season-spring-leaf" />}
        {season === "summer" && <div className="char-season-item season-summer-fan">扇</div>}
        {season === "autumn" && <div className="char-season-item season-autumn-leaf" />}
        {season === "winter" && <div className="char-season-item season-winter-scarf" />}

        {/* 모자/관 — 레벨별 크기 차이 확대 (C1) */}
        <div className={`char-hat ${state.level}`} style={{ borderColor: state.accentColor }}>
          {state.level === "master" && <div className="char-hat-ornament" />}
          {state.level === "master" && <div className="char-hat-wings" />}
          {state.level === "intermediate" && <div className="char-hat-band" style={{ background: state.accentColor }} />}
        </div>

        {/* 얼굴 */}
        <div className="char-face">
          <div className={`char-eyes mood-${state.mood}`}>
            <div className="char-eye left" />
            <div className="char-eye right" />
          </div>
          {state.mood === "proud" && <div className="char-blush left" />}
          {state.mood === "proud" && <div className="char-blush right" />}
          <div className={`char-mouth mood-${state.mood}`} />
        </div>

        {/* 몸 — 레벨/스탯별 차이 확대 (C1) */}
        <div className={`char-body ${state.level}`} style={{ borderColor: state.accentColor }}>
          {/* 허리띠 (intermediate+) */}
          {(state.level === "intermediate" || state.level === "master") && (
            <div className="char-belt" style={{ background: state.accentColor }} />
          )}
          {/* 어깨 장식 (master) */}
          {state.level === "master" && (
            <>
              <div className="char-shoulder left" style={{ background: state.accentColor }} />
              <div className="char-shoulder right" style={{ background: state.accentColor }} />
            </>
          )}

          {/* 왼팔 + 아이템 */}
          <div className={`char-arm left ${animating ? "arm-action" : ""}`}>
            {state.item === "needle" && <div className="char-item needle">鍼</div>}
            {state.item === "book" && <div className="char-item book">書</div>}
            {state.item === "herb" && <div className="char-item herb">草</div>}
            {state.item === "scroll" && <div className="char-item scroll">名</div>}
          </div>
          {/* 오른팔 */}
          <div className={`char-arm right ${animating ? "arm-action" : ""}`}>
            {/* C5: 해금 장식 */}
            {state.unlocked.needle && state.topStat === "medical" && (
              <div className="char-unlock-icon">⚕</div>
            )}
            {state.unlocked.bookDeco && state.topStat === "knowledge" && (
              <div className="char-unlock-icon">📖</div>
            )}
            {state.unlocked.herbBag && state.topStat === "virtue" && (
              <div className="char-unlock-icon">🌿</div>
            )}
            {state.unlocked.sash && state.topStat === "reputation" && (
              <div className="char-unlock-icon">🎗</div>
            )}
          </div>
        </div>

        {/* 다리 — 레벨별 옷자락 (C1) */}
        <div className={`char-legs ${state.level}`}>
          <div className="char-leg left" />
          <div className="char-leg right" />
          {state.level === "master" && <div className="char-robe-tail" style={{ borderColor: state.accentColor }} />}
        </div>
      </div>

      {/* 레벨 뱃지 */}
      <div className={`char-level-badge ${state.level}`}>
        {state.level === "beginner" ? "수련생" :
         state.level === "intermediate" ? "의원" : "명의"}
      </div>
    </div>
  );
}
