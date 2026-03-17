export default function HowToPlayPage({ game }) {
  return (
    <main className="page how-to-play-page">
      <h1>게임 방법</h1>
      <p>이 게임은 7개 시대를 순서대로 통과하는 개인형 학습 시뮬레이션입니다.</p>
      <p>각 시대마다 시대 설명을 읽고 4개의 선택지 중 하나를 고르십시오.</p>
      <p>선택에 따라 다음 4개 점수가 변합니다.</p>

      <ul>
        <li>
          <strong>學術名聲</strong>: 학설적 권위, 이론 형성력, 후대 영향
        </li>
        <li>
          <strong>臨床信賴度</strong>: 실제 치료 역량, 임상 적용성, 현장 영향
        </li>
        <li>
          <strong>文獻理解度</strong>: 고전과 의서 이해, 체계적 학습
        </li>
        <li>
          <strong>百姓好感度</strong>: 민생, 구휼, 생활 의료, 실용성
        </li>
      </ul>

      <p>
        정답은 하나가 아닙니다. 중요한 것은 각 시대의 의학적 환경 속에서 어떤
        길을 택했는지를 이해하는 것입니다.
      </p>

      <div className="button-group">
        <button onClick={() => game.startGame("")}>게임 시작</button>
        <button onClick={game.goToStart}>처음으로 돌아가기</button>
      </div>
    </main>
  );
}
