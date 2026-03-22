import React, { useState, useEffect, useRef, useCallback } from "react";

// 맥진 미니게임 — 맥박 리듬에 맞춰 타이밍 클릭
const TOTAL_BEATS = 6;
const BEAT_INTERVAL = 1200; // ms between beats
const PERFECT_WINDOW = 150; // ±ms for perfect
const GOOD_WINDOW = 300;    // ±ms for good

export default function PulseGame({ onComplete }) {
  const [phase, setPhase] = useState("ready"); // ready | playing | result
  const [currentBeat, setCurrentBeat] = useState(0);
  const [score, setScore] = useState(0);
  const [pulseAnim, setPulseAnim] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const beatTimeRef = useRef(null);
  const beatTimerRef = useRef(null);
  const missTimerRef = useRef(null);

  const startGame = useCallback(() => {
    setPhase("playing");
    setCurrentBeat(0);
    setScore(0);
    setFeedback(null);
    scheduleBeat(0);
  }, []);

  function scheduleBeat(beatIndex) {
    if (beatIndex >= TOTAL_BEATS) {
      setTimeout(() => setPhase("result"), 500);
      return;
    }
    const delay = BEAT_INTERVAL + (Math.random() * 400 - 200); // slight randomness
    beatTimerRef.current = setTimeout(() => {
      beatTimeRef.current = Date.now();
      setPulseAnim(true);
      setTimeout(() => setPulseAnim(false), 300);
      setCurrentBeat(beatIndex + 1);

      missTimerRef.current = setTimeout(() => {
        if (!beatTimeRef.current) return;
        beatTimeRef.current = null;
        setFeedback("miss");
        setTimeout(() => setFeedback(null), 400);
        scheduleBeat(beatIndex + 1);
      }, GOOD_WINDOW);
    }, delay);
  }

  function handleTap() {
    if (phase !== "playing" || !beatTimeRef.current) return;

    const diff = Math.abs(Date.now() - beatTimeRef.current);
    let result;
    if (diff <= PERFECT_WINDOW) {
      result = "perfect";
      setScore((s) => s + 2);
    } else if (diff <= GOOD_WINDOW) {
      result = "good";
      setScore((s) => s + 1);
    } else {
      result = "miss";
    }

    setFeedback(result);
    setTimeout(() => setFeedback(null), 400);
    beatTimeRef.current = null;
    if (missTimerRef.current) clearTimeout(missTimerRef.current);

    // Schedule next beat
    scheduleBeat(currentBeat);
  }

  useEffect(() => {
    return () => {
      if (beatTimerRef.current) clearTimeout(beatTimerRef.current);
      if (missTimerRef.current) clearTimeout(missTimerRef.current);
    };
  }, []);

  const maxScore = TOTAL_BEATS * 2;
  const pct = Math.round((score / maxScore) * 100);

  function getResultDelta() {
    if (pct >= 80) return { medical: 3, label: "훌륭한 맥진 실력!" };
    if (pct >= 50) return { medical: 2, label: "괜찮은 맥진 감각입니다." };
    return { medical: 1, label: "맥진은 더 수련이 필요합니다." };
  }

  return (
    <div className="minigame-container">
      <div className="minigame-header">
        <span className="minigame-icon">脈</span>
        <h2>맥진(脈診) 수련</h2>
        <p>맥박이 뛸 때 타이밍에 맞춰 클릭하세요!</p>
      </div>

      {phase === "ready" && (
        <div className="minigame-ready">
          <p>맥박의 리듬을 느끼고, 맥이 뛸 때 정확히 눌러보세요.</p>
          <button className="btn-primary" onClick={startGame}>시작</button>
        </div>
      )}

      {phase === "playing" && (
        <div className="minigame-playing" onClick={handleTap}>
          <div className="pulse-area">
            <div className={`pulse-circle ${pulseAnim ? "pulse-beat" : ""}`} />
            <div className="pulse-line">
              {Array.from({ length: currentBeat }).map((_, i) => (
                <span key={i} className="pulse-dot" />
              ))}
            </div>
          </div>
          <div className="pulse-progress">{currentBeat} / {TOTAL_BEATS}</div>
          {feedback && (
            <div className={`pulse-feedback ${feedback}`}>
              {feedback === "perfect" ? "完璧!" : feedback === "good" ? "좋아요!" : "빗나감..."}
            </div>
          )}
          <p className="pulse-hint">화면을 클릭하세요</p>
        </div>
      )}

      {phase === "result" && (
        <div className="minigame-result">
          <div className="minigame-score">{score} / {maxScore}</div>
          <p>{getResultDelta().label}</p>
          <div className="raising-delta-tag positive">의술 +{getResultDelta().medical}</div>
          <button className="btn-primary" onClick={() => onComplete(getResultDelta())}>
            계속하기
          </button>
        </div>
      )}
    </div>
  );
}
