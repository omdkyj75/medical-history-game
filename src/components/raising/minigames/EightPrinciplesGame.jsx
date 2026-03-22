import React, { useState, useMemo } from "react";

// 팔강변증(八綱辨證) 퀴즈 — 개론 수준
const QUESTIONS = [
  { q: "한증(寒證)과 열증(熱證)은 팔강 중 무엇을 판별하는가?", a: "한열(寒熱)", wrong: ["표리(表裏)", "허실(虛實)", "음양(陰陽)"] },
  { q: "표증(表證)과 이증(裏證)은 팔강 중 무엇을 판별하는가?", a: "표리(表裏)", wrong: ["한열(寒熱)", "허실(虛實)", "음양(陰陽)"] },
  { q: "허증(虛證)과 실증(實證)은 팔강 중 무엇을 판별하는가?", a: "허실(虛實)", wrong: ["한열(寒熱)", "표리(表裏)", "음양(陰陽)"] },
  { q: "팔강변증의 총강(總綱)은?", a: "음양(陰陽)", wrong: ["한열(寒熱)", "표리(表裏)", "허실(虛實)"] },
  { q: "오한발열, 두통, 맥부(脈浮)는 무엇을 의미하는가?", a: "표증(表證)", wrong: ["이증(裏證)", "허증(虛證)", "혈어(血瘀)"] },
  { q: "권태, 기력저하, 맥허(脈虛)는 무엇을 의미하는가?", a: "허증(虛證)", wrong: ["실증(實證)", "열증(熱證)", "표증(表證)"] },
  { q: "복부팽만, 변비, 맥실(脈實)은 무엇을 의미하는가?", a: "실증(實證)", wrong: ["허증(虛證)", "한증(寒證)", "표증(表證)"] },
  { q: "안면홍조, 구갈, 소변황적은 무엇을 의미하는가?", a: "열증(熱證)", wrong: ["한증(寒證)", "허증(虛證)", "표증(表證)"] },
  { q: "수족냉, 하리청곡, 맥지(脈遲)는 무엇을 의미하는가?", a: "한증(寒證)", wrong: ["열증(熱證)", "실증(實證)", "이증(裏證)"] },
  { q: "표증은 음양 중 어디에 속하는가?", a: "양증(陽證)", wrong: ["음증(陰證)"] }
];

const TOTAL = 4;
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

export default function EightPrinciplesGame({ onComplete }) {
  const [phase, setPhase] = useState("ready");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const questions = useMemo(() => shuffle(QUESTIONS).slice(0, TOTAL).map((q) => { const options = shuffle([q.a, ...q.wrong]); return { ...q, options, correctIndex: options.indexOf(q.a) }; }), []);
  const cur = questions[round];

  function handleSelect(idx) {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === cur.correctIndex;
    if (correct) setScore((s) => s + 1);
    setFeedback(correct ? "correct" : "wrong");
    setTimeout(() => { setFeedback(null); setSelected(null); round + 1 >= TOTAL ? setPhase("result") : setRound((r) => r + 1); }, 1200);
  }

  function getResult() {
    if (score >= 4) return { knowledge: 2, medical: 1, label: "변증에 능통!" };
    if (score >= 2) return { knowledge: 2, label: "변증의 기초가 쌓이고 있습니다." };
    return { knowledge: 1, label: "팔강변증을 더 공부합시다." };
  }

  return (
    <div className="minigame-container">
      <div className="minigame-header"><span className="minigame-icon">辨</span><h2>팔강변증(八綱辨證) 퀴즈</h2><p>한의학 진단의 핵심, 팔강을 구분하세요!</p></div>
      {phase === "ready" && <div className="minigame-ready"><p>표리·한열·허실·음양, 팔강변증의 기초 문제입니다.</p><button className="btn-primary" onClick={() => setPhase("playing")}>시작</button></div>}
      {phase === "playing" && cur && (
        <div className="minigame-playing">
          <div className="herb-question"><div className="herb-effect">{cur.q}</div></div>
          <div className="herb-options">{cur.options.map((opt, idx) => (<button key={idx} className={`herb-option-btn ${selected !== null ? (idx === cur.correctIndex ? "correct" : idx === selected ? "wrong" : "") : ""}`} onClick={() => handleSelect(idx)} disabled={selected !== null}>{opt}</button>))}</div>
          <div className="herb-progress">{round + 1} / {TOTAL}</div>
          {feedback && <div className={`pulse-feedback ${feedback === "correct" ? "perfect" : "miss"}`}>{feedback === "correct" ? "정답!" : `오답! 정답: ${cur.a}`}</div>}
        </div>
      )}
      {phase === "result" && <div className="minigame-result"><div className="minigame-score">{score} / {TOTAL}</div><p>{getResult().label}</p><div className="raising-delta-tag positive">학식/의술 보너스</div><button className="btn-primary" onClick={() => onComplete(getResult())}>계속하기</button></div>}
    </div>
  );
}
