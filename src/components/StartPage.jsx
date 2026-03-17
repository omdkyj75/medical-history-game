export default function StartPage({ game }) {
  return (
    <main className="page start-page">
      <h1>名醫의 길</h1>
      <p>7개 시대를 거치며 성장하는 한의학사 시뮬레이션</p>
      <p>
        당신은 시대를 건너며 수련하는 의원입니다. 春秋戰國에서 조선에
        이르는 7개 시대를 통과하며, 각 시대마다 하나의 선택을 통해 자신의
        의학적 길을 완성하십시오.
      </p>

      <div className="button-group">
        <button onClick={() => game.startGame("")}>시작하기</button>
        <button onClick={game.goToHowToPlay}>게임 방법 보기</button>
      </div>
    </main>
  );
}
