import React from "react";
import ChoiceCard from "./ChoiceCard";
import ScorePanel from "./ScorePanel";

export default function StagePage({ game }) {
  const { currentStage, currentStageIndex, currentChoices, stages, scores, selectChoice, activeEvent } = game;

  if (!currentStage) return null;

  const total = stages.length;

  return (
    <main className="page stage-page">
      {/* 진행 도트 */}
      <div className="stage-progress">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="stage-progress-step">
            <div
              className={`stage-progress-dot ${
                i < currentStageIndex ? "completed" : i === currentStageIndex ? "current" : ""
              }`}
            />
            <div
              className={`stage-progress-line ${i < currentStageIndex ? "completed" : ""}`}
            />
          </div>
        ))}
      </div>

      {/* 시대 헤더 */}
      <header className="stage-header">
        <h2>{currentStage.title}</h2>
      </header>

      {/* 키워드 태그 */}
      <div className="stage-keywords">
        {currentStage.keywords.map((kw) => (
          <span key={kw} className="stage-keyword-tag">{kw}</span>
        ))}
      </div>

      {/* 상황 설명 */}
      <p className="stage-narrative">{currentStage.description}</p>

      {/* 이벤트 */}
      {activeEvent && (
        <div className="event-card">
          <div className="event-card-label">이 시대의 변수</div>
          <h3 className="event-card-title">{activeEvent.title}</h3>
          <p className="event-card-desc">{activeEvent.description}</p>
          <div className="event-card-modifier">
            {Object.entries(activeEvent.modifier).map(([key, val]) => (
              <span key={key} className="event-mod-tag">
                {game.gameMeta.scoreLabels[key]} +{val}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 프롬프트 */}
      <p className="prompt">{currentStage.prompt}</p>

      {/* 선택지 */}
      <div className="choice-grid">
        {currentChoices.map((choice) => (
          <ChoiceCard
            key={choice.id}
            choice={choice}
            onSelect={() => selectChoice(choice)}
          />
        ))}
      </div>

      {/* 점수 인디케이터 (하단) */}
      <ScorePanel scores={scores} />
    </main>
  );
}
