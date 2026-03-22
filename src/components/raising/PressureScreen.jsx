import React, { useState, useEffect } from "react";

const STAT_LABELS = {
  medical: "의술", knowledge: "학식", virtue: "덕행",
  stamina: "체력", reputation: "명성"
};

export default function PressureScreen({ game }) {
  const pressure = game.currentPressure;
  const [showIntro, setShowIntro] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!pressure) return null;

  // 포켓몬 스타일 "!" 진입 연출
  if (showIntro) {
    return (
      <div className="pressure-intro">
        <div className="pressure-exclaim">!</div>
        <div className="pressure-intro-text">압박 상황 발생</div>
      </div>
    );
  }

  function handleBold() {
    if (selectedIdx !== null) return;
    setSelectedIdx(0);

    const stats = game.playerStats;
    const success = Object.entries(pressure.bold.require || {}).every(
      ([key, threshold]) => (stats[key] || 0) >= threshold
    );
    const delta = success ? pressure.bold.success : pressure.bold.fail;
    setResult({ success, delta });
    setTimeout(() => game.completePressure(delta), 1800);
  }

  function handleSafe() {
    if (selectedIdx !== null) return;
    setSelectedIdx(1);
    setResult({ success: true, delta: pressure.safe.delta });
    setTimeout(() => game.completePressure(pressure.safe.delta), 1200);
  }

  return (
    <div className="raising-event-screen pressure-screen">
      <div className="boss-event-badge pressure-badge">압박 상황</div>
      <h2 className="raising-event-title">{pressure.title}</h2>
      <p className="raising-event-description">{pressure.desc}</p>

      <div className="raising-event-choices">
        <button
          className={`raising-event-choice-btn pressure-bold ${selectedIdx === 0 ? "selected" : ""} ${selectedIdx !== null && selectedIdx !== 0 ? "dimmed" : ""}`}
          onClick={handleBold}
          disabled={selectedIdx !== null}
        >
          <div className="raising-event-choice-text">{pressure.bold.text}</div>
          {selectedIdx === 0 && result && (
            <div className="boss-result">
              <div className={`boss-result-label ${result.success ? "success" : "partial"}`}>
                {result.success ? "성공!" : "실패..."}
              </div>
              <div className="raising-event-choice-deltas">
                {Object.entries(result.delta).filter(([, v]) => v !== 0).map(([key, val]) => (
                  <span key={key} className={`raising-delta-tag ${val > 0 ? "positive" : "negative"}`}>
                    {STAT_LABELS[key] || key} {val > 0 ? `+${val}` : val}
                  </span>
                ))}
              </div>
            </div>
          )}
        </button>

        <button
          className={`raising-event-choice-btn pressure-safe ${selectedIdx === 1 ? "selected" : ""} ${selectedIdx !== null && selectedIdx !== 1 ? "dimmed" : ""}`}
          onClick={handleSafe}
          disabled={selectedIdx !== null}
        >
          <div className="raising-event-choice-text">{pressure.safe.text}</div>
          {selectedIdx === 1 && result && (
            <div className="raising-event-choice-deltas">
              {Object.entries(result.delta).filter(([, v]) => v !== 0).map(([key, val]) => (
                <span key={key} className={`raising-delta-tag positive`}>
                  {STAT_LABELS[key] || key} +{val}
                </span>
              ))}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
