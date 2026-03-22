import React, { useState, useMemo } from "react";

// 의학사 인물 퀴즈 — 교과서 기반
const QUESTIONS = [
  { q: "상한론(傷寒論)을 저술한 의성(醫聖)은?", a: "장중경(張仲景)", wrong: ["화타(華佗)", "편작(扁鵲)", "손사막(孫思邈)"] },
  { q: "동의보감(東醫寶鑑)을 편찬한 인물은?", a: "허준(許浚)", wrong: ["이제마(李濟馬)", "이규준(李圭晙)", "손사막(孫思邈)"] },
  { q: "사상의학(四象醫學)을 제창한 인물은?", a: "이제마(李濟馬)", wrong: ["허준(許浚)", "장중경(張仲景)", "유완소(劉完素)"] },
  { q: "본초강목(本草綱目)을 완성한 인물은?", a: "이시진(李時珍)", wrong: ["장경악(張景岳)", "오유성(吳有性)", "엽천사(葉天士)"] },
  { q: "대의정성(大醫精誠)을 저술한 약왕(藥王)은?", a: "손사막(孫思邈)", wrong: ["화타(華佗)", "왕숙화(王叔和)", "편작(扁鵲)"] },
  { q: "마비산(麻沸散)으로 수술을 시행한 의가는?", a: "화타(華佗)", wrong: ["장중경(張仲景)", "편작(扁鵲)", "이시진(李時珍)"] },
  { q: "금원사대가 중 한량파(寒涼派)의 대표는?", a: "유완소(劉完素)", wrong: ["장종정(張從正)", "이고(李杲)", "주진형(朱震亨)"] },
  { q: "금원사대가 중 보토파(補土派)의 대표는?", a: "이고(李杲)", wrong: ["유완소(劉完素)", "장종정(張從正)", "주진형(朱震亨)"] },
  { q: "맥경(脈經)을 저술한 인물은?", a: "왕숙화(王叔和)", wrong: ["황보밀(皇甫謐)", "소원방(巢元方)", "손사막(孫思邈)"] },
  { q: "온역론(溫疫論)에서 여기(戾氣)를 주장한 인물은?", a: "오유성(吳有性)", wrong: ["엽천사(葉天士)", "오국통(吳鞠通)", "장경악(張景岳)"] },
  { q: "부양론(扶陽論)을 제창한 조선 의가는?", a: "이규준(李圭晙)", wrong: ["이제마(李濟馬)", "허준(許浚)", "사암(舍巖)"] },
  { q: "향약구급방(鄕藥救急方)이 편찬된 시대는?", a: "고려", wrong: ["조선", "송", "명"] }
];

const TOTAL = 4;
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

export default function HistoryQuizGame({ onComplete }) {
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
    if (score >= 4) return { knowledge: 2, reputation: 1, label: "의학사 박사!" };
    if (score >= 2) return { knowledge: 2, label: "역사를 잘 기억하고 있습니다." };
    return { knowledge: 1, label: "의학사를 더 공부합시다." };
  }

  return (
    <div className="minigame-container">
      <div className="minigame-header"><span className="minigame-icon">史</span><h2>의학사(醫學史) 퀴즈</h2><p>역사 속 의가와 의서를 기억하세요!</p></div>
      {phase === "ready" && <div className="minigame-ready"><p>한중 의학사의 주요 인물과 저서에 대한 문제입니다.</p><button className="btn-primary" onClick={() => setPhase("playing")}>시작</button></div>}
      {phase === "playing" && cur && (
        <div className="minigame-playing">
          <div className="herb-question"><div className="herb-effect">{cur.q}</div></div>
          <div className="herb-options">{cur.options.map((opt, idx) => (<button key={idx} className={`herb-option-btn ${selected !== null ? (idx === cur.correctIndex ? "correct" : idx === selected ? "wrong" : "") : ""}`} onClick={() => handleSelect(idx)} disabled={selected !== null}>{opt}</button>))}</div>
          <div className="herb-progress">{round + 1} / {TOTAL}</div>
          {feedback && <div className={`pulse-feedback ${feedback === "correct" ? "perfect" : "miss"}`}>{feedback === "correct" ? "정답!" : `오답! 정답: ${cur.a}`}</div>}
        </div>
      )}
      {phase === "result" && <div className="minigame-result"><div className="minigame-score">{score} / {TOTAL}</div><p>{getResult().label}</p><div className="raising-delta-tag positive">학식/명성 보너스</div><button className="btn-primary" onClick={() => onComplete(getResult())}>계속하기</button></div>}
    </div>
  );
}
