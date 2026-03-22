import React, { useState, useMemo } from "react";

// 음양오행 분류 미니게임 — 개론 수준
const QUESTIONS = [
  { q: "심장(心)은 오행 중 무엇에 속하는가?", a: "화(火)", wrong: ["목(木)", "토(土)", "수(水)"] },
  { q: "간(肝)은 오행 중 무엇에 속하는가?", a: "목(木)", wrong: ["화(火)", "금(金)", "토(土)"] },
  { q: "폐(肺)는 오행 중 무엇에 속하는가?", a: "금(金)", wrong: ["수(水)", "화(火)", "목(木)"] },
  { q: "신장(腎)은 오행 중 무엇에 속하는가?", a: "수(水)", wrong: ["토(土)", "금(金)", "화(火)"] },
  { q: "비장(脾)은 오행 중 무엇에 속하는가?", a: "토(土)", wrong: ["목(木)", "수(水)", "금(金)"] },
  { q: "'열(熱)'은 음양 중 어디에 속하는가?", a: "양(陽)", wrong: ["음(陰)"] },
  { q: "'한(寒)'은 음양 중 어디에 속하는가?", a: "음(陰)", wrong: ["양(陽)"] },
  { q: "오행에서 목(木)이 생(生)하는 것은?", a: "화(火)", wrong: ["수(水)", "토(土)", "금(金)"] },
  { q: "오행에서 화(火)가 극(克)하는 것은?", a: "금(金)", wrong: ["수(水)", "목(木)", "토(土)"] },
  { q: "오행에서 수(水)가 생(生)하는 것은?", a: "목(木)", wrong: ["화(火)", "금(金)", "토(土)"] },
  { q: "봄(春)에 해당하는 오행은?", a: "목(木)", wrong: ["화(火)", "금(金)", "수(水)"] },
  { q: "쓴맛(苦味)에 해당하는 오행은?", a: "화(火)", wrong: ["목(木)", "토(土)", "금(金)"] },
  { q: "눈(目)과 관련된 장부는?", a: "간(肝)", wrong: ["심(心)", "폐(肺)", "신(腎)"] },
  { q: "귀(耳)와 관련된 장부는?", a: "신(腎)", wrong: ["간(肝)", "심(心)", "비(脾)"] }
];

const TOTAL = 4;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export default function YinYangGame({ onComplete }) {
  const [phase, setPhase] = useState("ready");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const questions = useMemo(() => {
    return shuffle(QUESTIONS).slice(0, TOTAL).map((q) => {
      const options = shuffle([q.a, ...q.wrong]);
      return { ...q, options, correctIndex: options.indexOf(q.a) };
    });
  }, []);

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
    if (score >= 4) return { knowledge: 3, label: "음양오행에 통달!" };
    if (score >= 2) return { knowledge: 2, label: "기초가 탄탄합니다." };
    return { knowledge: 1, label: "음양오행을 더 공부해야겠습니다." };
  }

  return (
    <div className="minigame-container">
      <div className="minigame-header"><span className="minigame-icon">陰陽</span><h2>음양오행(陰陽五行) 퀴즈</h2><p>한의학의 기초, 음양오행을 맞춰보세요!</p></div>
      {phase === "ready" && <div className="minigame-ready"><p>음양과 오행의 기본 개념을 묻는 문제입니다.</p><button className="btn-primary" onClick={() => setPhase("playing")}>시작</button></div>}
      {phase === "playing" && cur && (
        <div className="minigame-playing">
          <div className="herb-question"><div className="herb-effect">{cur.q}</div></div>
          <div className="herb-options">{cur.options.map((opt, idx) => (<button key={idx} className={`herb-option-btn ${selected !== null ? (idx === cur.correctIndex ? "correct" : idx === selected ? "wrong" : "") : ""}`} onClick={() => handleSelect(idx)} disabled={selected !== null}>{opt}</button>))}</div>
          <div className="herb-progress">{round + 1} / {TOTAL}</div>
          {feedback && <div className={`pulse-feedback ${feedback === "correct" ? "perfect" : "miss"}`}>{feedback === "correct" ? "정답!" : `오답! 정답: ${cur.a}`}</div>}
        </div>
      )}
      {phase === "result" && <div className="minigame-result"><div className="minigame-score">{score} / {TOTAL}</div><p>{getResult().label}</p><div className="raising-delta-tag positive">학식 +{getResult().knowledge}</div><button className="btn-primary" onClick={() => onComplete(getResult())}>계속하기</button></div>}
    </div>
  );
}
