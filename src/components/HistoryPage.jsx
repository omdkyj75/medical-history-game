import React, { useState } from "react";
import ResultCard from "./ResultCard";
import { clearResults } from "../utils/resultStorage";

export default function HistoryPage({ game }) {
  const { savedResults, goToStart } = game;
  const [selectedIndex, setSelectedIndex] = useState(null);

  const selected = selectedIndex !== null ? savedResults[selectedIndex] : null;

  function handleClear() {
    if (window.confirm("모든 기록을 삭제하시겠습니까?")) {
      clearResults();
      window.location.reload();
    }
  }

  return (
    <main className="page history-page">
      <h1>플레이 기록</h1>

      {savedResults.length === 0 ? (
        <p className="history-empty">아직 플레이 기록이 없습니다.</p>
      ) : (
        <>
          <div className="history-list">
            {savedResults.map((r, i) => (
              <div
                key={r.id}
                className={`history-item ${selectedIndex === i ? "selected" : ""}`}
                onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
              >
                <div className="history-item-main">
                  <span className="history-item-nickname">{r.nickname}</span>
                  <span className="history-item-title">{r.title}</span>
                </div>
                <div className="history-item-meta">
                  <span>{r.playerName}</span>
                  <span>
                    {new Date(r.timestamp).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div className="history-detail">
              <ResultCard
                result={selected}
                scores={selected.scores}
                timestamp={selected.timestamp}
              />
            </div>
          )}

          <button className="history-clear-btn" onClick={handleClear}>
            기록 전체 삭제
          </button>
        </>
      )}

      <div className="button-group">
        <button onClick={goToStart}>돌아가기</button>
      </div>
    </main>
  );
}
