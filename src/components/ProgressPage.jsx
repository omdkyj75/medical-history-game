import React from "react";
import ScorePanel from "./ScorePanel";

export default function ProgressPage({ game }) {
  const { history, scores, gameMeta, currentStageIndex, stages, closeProgress } = game;

  return (
    <main className="page progress-page">
      <h1>현재까지 진행 현황</h1>
      <p>
        {currentStageIndex + 1}/{stages.length} 시대를 통과했습니다.
      </p>

      <section className="progress-body">
        <div className="progress-main">
          <h2>시대별 선택 기록</h2>
          {history.length === 0 ? (
            <p>아직 선택한 기록이 없습니다.</p>
          ) : (
            <ul className="progress-history">
              {history.map((item) => (
                <li key={`${item.stageId}-${item.choiceId}`}>
                  <strong>{item.stageTitle}</strong>: {item.choiceTitle}
                  <span className="progress-figure">({item.figure})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="progress-sidebar">
          <ScorePanel scores={scores} labels={gameMeta.scoreLabels} />
        </aside>
      </section>

      <div className="button-group">
        <button onClick={closeProgress}>게임으로 돌아가기</button>
      </div>
    </main>
  );
}
