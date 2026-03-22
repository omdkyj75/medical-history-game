import React, { useState, useMemo } from "react";

// 경락 퀴즈 미니게임 — 12경맥과 장부 연결
const QUESTIONS = [
  { q: "수태음폐경(手太陰肺經)이 연결된 장부는?", a: "폐(肺)", wrong: ["심(心)", "간(肝)", "신(腎)"] },
  { q: "족양명위경(足陽明胃經)이 연결된 장부는?", a: "위(胃)", wrong: ["비(脾)", "대장(大腸)", "담(膽)"] },
  { q: "족태음비경(足太陰脾經)이 연결된 장부는?", a: "비(脾)", wrong: ["위(胃)", "폐(肺)", "간(肝)"] },
  { q: "수소음심경(手少陰心經)이 연결된 장부는?", a: "심(心)", wrong: ["폐(肺)", "소장(小腸)", "심포(心包)"] },
  { q: "족소음신경(足少陰腎經)이 연결된 장부는?", a: "신(腎)", wrong: ["방광(膀胱)", "간(肝)", "비(脾)"] },
  { q: "족궐음간경(足厥陰肝經)이 연결된 장부는?", a: "간(肝)", wrong: ["담(膽)", "신(腎)", "심(心)"] },
  { q: "수양명대장경(手陽明大腸經)이 연결된 장부는?", a: "대장(大腸)", wrong: ["소장(小腸)", "위(胃)", "폐(肺)"] },
  { q: "족태양방광경(足太陽膀胱經)이 연결된 장부는?", a: "방광(膀胱)", wrong: ["신(腎)", "위(胃)", "담(膽)"] },
  { q: "합곡(合谷)혈은 어느 경락에 속하는가?", a: "수양명대장경", wrong: ["수태음폐경", "족양명위경", "수소음심경"] },
  { q: "족삼리(足三里)혈은 어느 경락에 속하는가?", a: "족양명위경", wrong: ["족태음비경", "족소양담경", "족태양방광경"] }
];

const TOTAL = 4;
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

export default function MeridianGame({ onComplete }) {
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
    if (score >= 4) return { medical: 2, knowledge: 1, label: "경락에 통달!" };
    if (score >= 2) return { medical: 1, knowledge: 1, label: "경락 공부가 되고 있습니다." };
    return { knowledge: 1, label: "경락학을 더 공부합시다." };
  }

  return (
    <div className="minigame-container">
      <div className="minigame-header"><span className="minigame-icon">經</span><h2>경락(經絡) 퀴즈</h2><p>12경맥과 장부의 연결을 맞춰보세요!</p></div>
      {phase === "ready" && <div className="minigame-ready"><p>경맥과 장부, 주요 경혈에 대한 문제입니다.</p><button className="btn-primary" onClick={() => setPhase("playing")}>시작</button></div>}
      {phase === "playing" && cur && (
        <div className="minigame-playing">
          <div className="herb-question"><div className="herb-effect">{cur.q}</div></div>
          <div className="herb-options">{cur.options.map((opt, idx) => (<button key={idx} className={`herb-option-btn ${selected !== null ? (idx === cur.correctIndex ? "correct" : idx === selected ? "wrong" : "") : ""}`} onClick={() => handleSelect(idx)} disabled={selected !== null}>{opt}</button>))}</div>
          <div className="herb-progress">{round + 1} / {TOTAL}</div>
          {feedback && <div className={`pulse-feedback ${feedback === "correct" ? "perfect" : "miss"}`}>{feedback === "correct" ? "정답!" : `오답! 정답: ${cur.a}`}</div>}
        </div>
      )}
      {phase === "result" && <div className="minigame-result"><div className="minigame-score">{score} / {TOTAL}</div><p>{getResult().label}</p><div className="raising-delta-tag positive">의술/학식 보너스</div><button className="btn-primary" onClick={() => onComplete(getResult())}>계속하기</button></div>}
    </div>
  );
}
