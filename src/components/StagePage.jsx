import React from "react";
import ChoiceCard from "./ChoiceCard";
import ScorePanel from "./ScorePanel";

export default function StagePage({ game }) {
  const { currentStage, currentStageIndex, gameMeta, scores, selectChoice } = game;

  if (!currentStage) return null;

  return (
    <main className="page stage-page">
      <header className="stage-header">
        <div>진행률 {currentStageIndex + 1}/{gameMeta.totalStages}</div>
        <h2>{currentStage.title}</h2>
      </header>

      <section className="stage-body">
        <div className="stage-main">
          <p>{currentStage.description}</p>

          <div className="keywords">
            <strong>핵심 키워드</strong>
            <p>{currentStage.keywords.join(" · ")}</p>
          </div>

          <p className="prompt">{currentStage.prompt}</p>

          <div className="choice-grid">
            {currentStage.choices.map((choice) => (
              <ChoiceCard
                key={choice.id}
                choice={choice}
                onSelect={() => selectChoice(choice)}
              />
            ))}
          </div>
        </div>

        <aside className="stage-sidebar">
          <ScorePanel scores={scores} labels={gameMeta.scoreLabels} />
        </aside>
      </section>
    </main>
  );
}
