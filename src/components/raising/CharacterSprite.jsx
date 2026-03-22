import React, { useMemo } from "react";

// CSS 픽셀아트 한의사 캐릭터
// 스탯에 따라 들고 있는 아이템/표정이 바뀜
function getCharacterState(stats) {
  const { medical, knowledge, virtue, stamina, reputation } = stats;
  const topStat = Object.entries({ medical, knowledge, virtue, reputation })
    .sort((a, b) => b[1] - a[1])[0][0];

  // 들고 있는 아이템
  let item = "none";
  if (topStat === "medical") item = "needle"; // 침
  else if (topStat === "knowledge") item = "book"; // 책
  else if (topStat === "virtue") item = "herb"; // 약초
  else if (topStat === "reputation") item = "scroll"; // 두루마리

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

  return { item, mood, level, topStat };
}

export default function CharacterSprite({ stats, animating, season }) {
  const state = useMemo(() => getCharacterState(stats), [stats]);
  const seasonClass = season ? `season-${season}` : "";

  return (
    <div className={`char-sprite-container ${seasonClass}`}>
      <div className={`char-sprite ${state.level} mood-${state.mood} ${animating ? "char-animating" : ""}`}>
        {/* 모자/관 */}
        <div className={`char-hat ${state.level}`}>
          {state.level === "master" && <div className="char-hat-ornament" />}
        </div>

        {/* 얼굴 */}
        <div className="char-face">
          <div className={`char-eyes mood-${state.mood}`}>
            <div className="char-eye left" />
            <div className="char-eye right" />
          </div>
          <div className={`char-mouth mood-${state.mood}`} />
        </div>

        {/* 몸 */}
        <div className={`char-body ${state.level}`}>
          {/* 왼팔 + 아이템 */}
          <div className={`char-arm left ${animating ? "arm-action" : ""}`}>
            {state.item === "needle" && <div className="char-item needle">鍼</div>}
            {state.item === "book" && <div className="char-item book">書</div>}
            {state.item === "herb" && <div className="char-item herb">草</div>}
            {state.item === "scroll" && <div className="char-item scroll">名</div>}
          </div>
          {/* 오른팔 */}
          <div className={`char-arm right ${animating ? "arm-action" : ""}`} />
        </div>

        {/* 다리 */}
        <div className="char-legs">
          <div className="char-leg left" />
          <div className="char-leg right" />
        </div>
      </div>

      {/* 레벨 표시 */}
      <div className={`char-level-badge ${state.level}`}>
        {state.level === "beginner" ? "수련생" :
         state.level === "intermediate" ? "의원" : "명의"}
      </div>
    </div>
  );
}
