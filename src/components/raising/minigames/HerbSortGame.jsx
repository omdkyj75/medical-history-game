import React, { useState, useMemo } from "react";

// 약초 분류 미니게임 — 약초와 효능 매칭
const HERB_POOL = [
  { name: "인삼(人蔘)", effect: "보기(補氣)", category: "보약" },
  { name: "감초(甘草)", effect: "조화(調和)", category: "보약" },
  { name: "황련(黃連)", effect: "청열(淸熱)", category: "청열약" },
  { name: "부자(附子)", effect: "온양(溫陽)", category: "온리약" },
  { name: "당귀(當歸)", effect: "보혈(補血)", category: "보혈약" },
  { name: "마황(麻黃)", effect: "발한(發汗)", category: "해표약" },
  { name: "석고(石膏)", effect: "청열사화(淸熱瀉火)", category: "청열약" },
  { name: "대황(大黃)", effect: "사하(瀉下)", category: "공하약" },
  { name: "황기(黃芪)", effect: "보기고표(補氣固表)", category: "보기약" },
  { name: "지황(地黃)", effect: "자음(滋陰)", category: "보음약" },
  { name: "계지(桂枝)", effect: "발한해기(發汗解肌)", category: "해표약" },
  { name: "백작약(白芍藥)", effect: "양혈렴음(養血斂陰)", category: "보혈약" },
  { name: "천궁(川芎)", effect: "활혈행기(活血行氣)", category: "활혈약" },
  { name: "백출(白朮)", effect: "건비조습(健脾燥濕)", category: "보기약" },
  { name: "복령(茯苓)", effect: "이수삼습(利水滲濕)", category: "이수약" },
  { name: "반하(半夏)", effect: "조습화담(燥濕化痰)", category: "화담약" },
  { name: "진피(陳皮)", effect: "이기조습(理氣燥濕)", category: "이기약" },
  { name: "시호(柴胡)", effect: "화해소양(和解少陽)", category: "해표약" },
  { name: "황금(黃芩)", effect: "청열조습(淸熱燥濕)", category: "청열약" },
  { name: "생강(生薑)", effect: "발산풍한(發散風寒)", category: "해표약" },
  { name: "대조(大棗)", effect: "보중익기(補中益氣)", category: "보기약" },
  { name: "작약(芍藥)", effect: "유간지통(柔肝止痛)", category: "보혈약" },
  { name: "행인(杏仁)", effect: "지해평천(止咳平喘)", category: "지해약" },
  { name: "건강(乾薑)", effect: "온중산한(溫中散寒)", category: "온리약" }
];

const TOTAL_ROUNDS = 4;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HerbSortGame({ onComplete }) {
  const [phase, setPhase] = useState("ready");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selected, setSelected] = useState(null);

  const questions = useMemo(() => {
    const shuffled = shuffle(HERB_POOL);
    return shuffled.slice(0, TOTAL_ROUNDS).map((herb) => {
      const wrongOptions = shuffle(
        HERB_POOL.filter((h) => h.effect !== herb.effect)
      ).slice(0, 3);
      const options = shuffle([herb, ...wrongOptions]);
      return { herb, options, correctIndex: options.indexOf(herb) };
    });
  }, []);

  const currentQ = questions[round];

  function handleSelect(idx) {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === currentQ.correctIndex;
    if (correct) setScore((s) => s + 1);
    setFeedback(correct ? "correct" : "wrong");

    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      if (round + 1 >= TOTAL_ROUNDS) {
        setPhase("result");
      } else {
        setRound((r) => r + 1);
      }
    }, 1200);
  }

  function getResultDelta() {
    if (score >= 4) return { knowledge: 3, label: "본초에 정통하시군요!" };
    if (score >= 2) return { knowledge: 2, label: "본초 지식이 쌓이고 있습니다." };
    return { knowledge: 1, label: "본초학을 더 공부해야겠습니다." };
  }

  return (
    <div className="minigame-container">
      <div className="minigame-header">
        <span className="minigame-icon">草</span>
        <h2>약초 분류(本草 分類)</h2>
        <p>약초의 효능에 맞는 약재를 고르세요!</p>
      </div>

      {phase === "ready" && (
        <div className="minigame-ready">
          <p>주어진 효능을 가진 약초를 4개의 보기 중에서 고르세요.</p>
          <button className="btn-primary" onClick={() => setPhase("playing")}>시작</button>
        </div>
      )}

      {phase === "playing" && currentQ && (
        <div className="minigame-playing">
          <div className="herb-question">
            <div className="herb-effect-label">이 효능을 가진 약초는?</div>
            <div className="herb-effect">{currentQ.herb.effect}</div>
            <div className="herb-category">분류: {currentQ.herb.category}</div>
          </div>

          <div className="herb-options">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                className={`herb-option-btn ${
                  selected !== null
                    ? idx === currentQ.correctIndex
                      ? "correct"
                      : idx === selected
                      ? "wrong"
                      : ""
                    : ""
                }`}
                onClick={() => handleSelect(idx)}
                disabled={selected !== null}
              >
                {opt.name}
              </button>
            ))}
          </div>

          <div className="herb-progress">{round + 1} / {TOTAL_ROUNDS}</div>

          {feedback && (
            <div className={`pulse-feedback ${feedback === "correct" ? "perfect" : "miss"}`}>
              {feedback === "correct" ? "정답!" : `오답! 정답: ${currentQ.herb.name}`}
            </div>
          )}
        </div>
      )}

      {phase === "result" && (
        <div className="minigame-result">
          <div className="minigame-score">{score} / {TOTAL_ROUNDS}</div>
          <p>{getResultDelta().label}</p>
          <div className="raising-delta-tag positive">학식 +{getResultDelta().knowledge}</div>
          <button className="btn-primary" onClick={() => onComplete(getResultDelta())}>
            계속하기
          </button>
        </div>
      )}
    </div>
  );
}
