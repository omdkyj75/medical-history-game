import React, { useState, useMemo } from "react";

// 사진(四診) 퀴즈 — 망문문절 기초
const QUESTIONS = [
  { q: "환자의 얼굴색을 관찰하는 진단법은?", a: "망진(望診)", wrong: ["문진(聞診)", "문진(問診)", "절진(切診)"] },
  { q: "환자의 목소리와 체취를 듣고 맡는 진단법은?", a: "문진(聞診)", wrong: ["망진(望診)", "문진(問診)", "절진(切診)"] },
  { q: "환자에게 증상을 질문하는 진단법은?", a: "문진(問診)", wrong: ["망진(望診)", "문진(聞診)", "절진(切診)"] },
  { q: "맥을 짚어 진단하는 방법은?", a: "절진(切診)", wrong: ["망진(望診)", "문진(聞診)", "문진(問診)"] },
  { q: "설태(舌苔)를 보는 것은 어떤 진단법인가?", a: "망진(望診)", wrong: ["절진(切診)", "문진(問診)", "문진(聞診)"] },
  { q: "맥이 빠르게 뛰는 것을 무엇이라 하는가?", a: "삭맥(數脈)", wrong: ["지맥(遲脈)", "활맥(滑脈)", "현맥(弦脈)"] },
  { q: "맥이 느리게 뛰는 것을 무엇이라 하는가?", a: "지맥(遲脈)", wrong: ["삭맥(數脈)", "부맥(浮脈)", "침맥(沈脈)"] },
  { q: "맥이 표면에서 느껴지는 것을 무엇이라 하는가?", a: "부맥(浮脈)", wrong: ["침맥(沈脈)", "삭맥(數脈)", "활맥(滑脈)"] },
  { q: "혀가 붉고 설태가 누런 것은 무엇을 의미하는가?", a: "열증(熱證)", wrong: ["한증(寒證)", "허증(虛證)", "습증(濕證)"] },
  { q: "혀가 담백하고 설태가 흰 것은 무엇을 의미하는가?", a: "한증(寒證)", wrong: ["열증(熱證)", "실증(實證)", "혈어(血瘀)"] }
];

const TOTAL = 4;
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

export default function FourDiagGame({ onComplete }) {
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
    if (score >= 4) return { medical: 3, label: "사진에 능통합니다!" };
    if (score >= 2) return { medical: 2, label: "진단 감각이 자라고 있습니다." };
    return { medical: 1, label: "망문문절을 더 익혀야겠습니다." };
  }

  return (
    <div className="minigame-container">
      <div className="minigame-header"><span className="minigame-icon">診</span><h2>사진(四診) 퀴즈</h2><p>망(望)·문(聞)·문(問)·절(切), 진단의 기초!</p></div>
      {phase === "ready" && <div className="minigame-ready"><p>한의학 진단의 네 기둥, 사진법에 대한 문제입니다.</p><button className="btn-primary" onClick={() => setPhase("playing")}>시작</button></div>}
      {phase === "playing" && cur && (
        <div className="minigame-playing">
          <div className="herb-question"><div className="herb-effect">{cur.q}</div></div>
          <div className="herb-options">{cur.options.map((opt, idx) => (<button key={idx} className={`herb-option-btn ${selected !== null ? (idx === cur.correctIndex ? "correct" : idx === selected ? "wrong" : "") : ""}`} onClick={() => handleSelect(idx)} disabled={selected !== null}>{opt}</button>))}</div>
          <div className="herb-progress">{round + 1} / {TOTAL}</div>
          {feedback && <div className={`pulse-feedback ${feedback === "correct" ? "perfect" : "miss"}`}>{feedback === "correct" ? "정답!" : `오답! 정답: ${cur.a}`}</div>}
        </div>
      )}
      {phase === "result" && <div className="minigame-result"><div className="minigame-score">{score} / {TOTAL}</div><p>{getResult().label}</p><div className="raising-delta-tag positive">의술 +{getResult().medical}</div><button className="btn-primary" onClick={() => onComplete(getResult())}>계속하기</button></div>}
    </div>
  );
}
