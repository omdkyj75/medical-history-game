import React from "react";

const SCORE_ITEMS = [
  { label: "學術名聲", desc: "학설적 권위, 이론 형성력, 후대 영향" },
  { label: "臨床信賴度", desc: "실제 치료 역량, 임상 적용성, 현장 영향" },
  { label: "文獻理解度", desc: "고전과 의서 이해, 체계적 학습" },
  { label: "百姓好感度", desc: "민생, 구휼, 생활 의료, 실용성" }
];

export default function HowToPlayPage({ game }) {
  return (
    <main className="page how-to-play-page">
      <h1>게임 방법</h1>
      <p>
        7개 시대를 순서대로 통과하는 개인형 학습 시뮬레이션입니다.
        각 시대마다 4개의 선택지 중 하나를 고르면 4가지 성향 점수가 변합니다.
      </p>

      <div className="how-to-play-grid">
        {SCORE_ITEMS.map((item) => (
          <div key={item.label} className="how-to-play-item">
            <span className="how-to-play-item-label">{item.label}</span>
            <span className="how-to-play-item-desc">{item.desc}</span>
          </div>
        ))}
      </div>

      <p>
        정답은 하나가 아닙니다. 중요한 것은 각 시대의 의학적 환경 속에서
        어떤 길을 택했는지를 이해하는 것입니다.
      </p>

      <div className="button-group">
        <button onClick={() => game.startGame("")}>게임 시작</button>
        <button className="btn-text" onClick={game.goToStart}>처음으로 돌아가기</button>
      </div>
    </main>
  );
}
