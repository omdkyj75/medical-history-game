import React from "react";
import StatPanel from "./StatPanel";

const STAT_LABELS = {
  medical: "의술", knowledge: "학식", virtue: "덕행",
  stamina: "체력", reputation: "명성"
};

// 턴 결과에 따른 한 줄 일기
const DIARY_TEMPLATES = {
  "study-classics": [
    "오늘은 고전의 깊이에 빠져들었다.",
    "경전의 한 구절이 마음에 남는다.",
    "이론의 세계는 끝이 없구나."
  ],
  "clinical-practice": [
    "환자의 얼굴에 안도가 번졌다.",
    "진료실에서 보낸 하루가 길었다.",
    "경전은 읽었지만 환자는 기다려주지 않는다."
  ],
  "public-service": [
    "백성의 고통 앞에 의술이 빛났다.",
    "작은 도움이지만 보람을 느낀다.",
    "이것이 의원의 본분이 아닐까."
  ],
  "visit-master": [
    "스승의 한마디가 수년의 공부보다 깊었다.",
    "배움에는 끝이 없다는 걸 다시 느낀다.",
    "스승의 가르침을 곱씹는 밤이다."
  ],
  "herb-gathering": [
    "산야의 약초가 오늘도 나를 가르친다.",
    "자연 속에서 몸과 마음이 회복된다.",
    "본초의 지식은 발로 뛰어야 얻는다."
  ],
  "academic-exchange": [
    "논쟁 속에서 새로운 관점을 얻었다.",
    "다른 의가의 학설에 자극받는 하루.",
    "내 학설이 세상에 알려지기 시작했다."
  ],
  "rest": [
    "명의의 길도 결국 휴식이 필요하다.",
    "쉬어가는 것도 수련이다.",
    "이론은 완벽했으나 체력이 부족했다."
  ]
};

// 칭호 체크
function checkTitle(stats) {
  const { medical, knowledge, virtue, reputation } = stats;
  if (medical >= 30 && knowledge >= 30 && virtue >= 30 && reputation >= 30) return "四德兼備 — 사덕겸비의 의원";
  if (medical >= 50) return "妙手 — 묘수의 의원";
  if (knowledge >= 50) return "博學 — 박학의 의원";
  if (virtue >= 50) return "仁心 — 인심의 의원";
  if (reputation >= 50) return "名醫 — 이름난 의원";
  if (medical >= 25) return "良醫 — 양의";
  if (knowledge >= 25) return "學人 — 학인";
  if (virtue >= 25) return "善人 — 선인";
  return null;
}

export default function ActivityResultScreen({ game }) {
  const activity = game.activities.find((a) => a.id === game.selectedActivity);
  const info = game.getActivityInfo(game.selectedActivity);
  const delta = game.lastDelta || {};
  const deltaEntries = Object.entries(delta).filter(([, v]) => v !== 0);

  // 한 줄 일기
  const templates = DIARY_TEMPLATES[game.selectedActivity] || ["오늘도 한 걸음 나아갔다."];
  const diary = templates[Math.floor(Math.random() * templates.length)];

  // 칭호 체크
  const title = checkTitle(game.playerStats);

  return (
    <div className="raising-result-screen">
      <div className="raising-result-header">
        <span className="raising-result-icon">{activity?.icon}</span>
        <h2>{info?.flavorTitle || activity?.title}</h2>
      </div>

      <p className="raising-result-diary">"{diary}"</p>

      <div className="raising-result-deltas">
        {deltaEntries.map(([key, val]) => (
          <div key={key} className={`raising-result-delta-item ${val > 0 ? "positive" : "negative"}`}>
            <span className="raising-result-delta-label">{STAT_LABELS[key] || key}</span>
            <span className="raising-result-delta-value">{val > 0 ? `+${val}` : val}</span>
          </div>
        ))}
      </div>

      {title && (
        <div className="raising-title-badge">
          <span className="raising-title-label">칭호 획득</span>
          <span className="raising-title-text">{title}</span>
        </div>
      )}

      {game.activeTraits && game.activeTraits.length > 0 && (
        <div className="raising-traits-display">
          {game.activeTraits.map((t) => (
            <div key={t.id} className="raising-trait-tag">
              <span className="trait-hanja">{t.hanja}</span>
              <span className="trait-name">{t.name}</span>
              <span className="trait-effect">{t.effect}</span>
            </div>
          ))}
        </div>
      )}

      <StatPanel stats={game.playerStats} statConfig={game.stats} />

      <button className="btn-primary" onClick={game.proceedAfterResult}>
        계속하기
      </button>
    </div>
  );
}
