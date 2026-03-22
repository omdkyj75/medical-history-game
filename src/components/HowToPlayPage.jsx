import React from "react";

const SCORE_ITEMS = [
  { label: "의술(醫術)", desc: "진료와 처방, 침구와 본초 등 실제 치료 능력" },
  { label: "학식(學識)", desc: "경전과 이론, 음양오행과 병리학설에 대한 이해" },
  { label: "덕행(德行)", desc: "의덕(醫德)과 인품, 환자와 백성에 대한 신뢰" },
  { label: "체력(體力)", desc: "수련과 활동을 지탱하는 건강과 체력" },
  { label: "명성(名聲)", desc: "의학계와 세상에 알려진 정도" }
];

export default function HowToPlayPage({ game }) {
  return (
    <main className="page how-to-play-page">
      <h1>게임 방법</h1>
      <p>
        10개 시대를 순서대로 통과하는 육성 시뮬레이션입니다.
        매 턴마다 7가지 행동 중 하나를 선택하면 5가지 능력치가 변합니다.
        체력 관리에 주의하세요!
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
