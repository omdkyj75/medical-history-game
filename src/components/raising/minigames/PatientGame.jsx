import React, { useState, useMemo } from "react";

// 환자 치료 미니게임 — 증상 보고 올바른 처방 선택
const CASES = [
  {
    symptoms: "발열, 오한, 두통, 몸살",
    diagnosis: "태양병(太陽病) - 풍한표증",
    correct: "계지탕(桂枝湯)",
    wrong: ["사물탕(四物湯)", "보중익기탕(補中益氣湯)", "대승기탕(大承氣湯)"]
  },
  {
    symptoms: "고열, 심한 갈증, 땀이 많음",
    diagnosis: "양명병(陽明病) - 기분열성",
    correct: "백호탕(白虎湯)",
    wrong: ["마황탕(麻黃湯)", "소시호탕(小柴胡湯)", "이중환(理中丸)"]
  },
  {
    symptoms: "식욕부진, 피로감, 기운 없음",
    diagnosis: "비기허(脾氣虛)",
    correct: "보중익기탕(補中益氣湯)",
    wrong: ["백호탕(白虎湯)", "대시호탕(大柴胡湯)", "마자인환(麻子仁丸)"]
  },
  {
    symptoms: "가슴 답답, 옆구리 통증, 입 쓴맛",
    diagnosis: "소양병(少陽病) - 반표반리",
    correct: "소시호탕(小柴胡湯)",
    wrong: ["계지탕(桂枝湯)", "백호탕(白虎湯)", "사역탕(四逆湯)"]
  },
  {
    symptoms: "수족냉, 설사, 맥미약",
    diagnosis: "소음병(少陰病) - 양허한증",
    correct: "사역탕(四逆湯)",
    wrong: ["백호탕(白虎湯)", "마황탕(麻黃湯)", "보중익기탕(補中益氣湯)"]
  },
  {
    symptoms: "어지러움, 안면창백, 심계항진",
    diagnosis: "혈허(血虛)",
    correct: "사물탕(四物湯)",
    wrong: ["소시호탕(小柴胡湯)", "대승기탕(大承氣湯)", "계지탕(桂枝湯)"]
  }
];

const TOTAL_ROUNDS = 3;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PatientGame({ onComplete }) {
  const [phase, setPhase] = useState("ready");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const questions = useMemo(() => {
    return shuffle(CASES).slice(0, TOTAL_ROUNDS).map((c) => {
      const options = shuffle([c.correct, ...c.wrong]);
      return { ...c, options, correctIndex: options.indexOf(c.correct) };
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
    }, 1500);
  }

  function getResultDelta() {
    if (score >= 3) return { medical: 2, reputation: 2, label: "명의의 자질이 보입니다!" };
    if (score >= 2) return { medical: 2, reputation: 1, label: "치료 감각이 좋습니다." };
    return { medical: 1, label: "임상 경험이 더 필요합니다." };
  }

  return (
    <div className="minigame-container">
      <div className="minigame-header">
        <span className="minigame-icon">患</span>
        <h2>환자 치료(患者 治療)</h2>
        <p>환자의 증상을 보고 적절한 처방을 선택하세요!</p>
      </div>

      {phase === "ready" && (
        <div className="minigame-ready">
          <p>환자가 호소하는 증상을 보고, 가장 적절한 처방을 고르세요.</p>
          <button className="btn-primary" onClick={() => setPhase("playing")}>진료 시작</button>
        </div>
      )}

      {phase === "playing" && currentQ && (
        <div className="minigame-playing">
          <div className="patient-case">
            <div className="patient-emoji">病</div>
            <div className="patient-symptoms">
              <div className="patient-label">환자의 증상</div>
              <div className="patient-symptom-text">{currentQ.symptoms}</div>
            </div>
          </div>

          {feedback && selected !== null && (
            <div className="patient-diagnosis">
              <strong>진단:</strong> {currentQ.diagnosis}
            </div>
          )}

          <div className="patient-label" style={{ marginTop: 16 }}>처방을 선택하세요</div>
          <div className="patient-options">
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
                {opt}
              </button>
            ))}
          </div>

          <div className="herb-progress">{round + 1} / {TOTAL_ROUNDS}</div>
        </div>
      )}

      {phase === "result" && (
        <div className="minigame-result">
          <div className="minigame-score">{score} / {TOTAL_ROUNDS}</div>
          <p>{getResultDelta().label}</p>
          <div className="minigame-result-deltas">
            {Object.entries(getResultDelta()).filter(([k, v]) => k !== "label" && v > 0).map(([key, val]) => (
              <span key={key} className="raising-delta-tag positive">
                {key === "medical" ? "의술" : key === "reputation" ? "명성" : key} +{val}
              </span>
            ))}
          </div>
          <button className="btn-primary" onClick={() => onComplete(getResultDelta())}>
            계속하기
          </button>
        </div>
      )}
    </div>
  );
}
