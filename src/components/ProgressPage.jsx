import React from "react";
import { ScoreBarGroup } from "./ScoreBar";

const TENDENCY_NAMES = {
  academicReputation: "이론 탐구파",
  clinicalTrust: "현장 임상파",
  textUnderstanding: "문헌 탐독파",
  publicFavor: "백성 구휼파"
};

const TENDENCY_COMMENTS = {
  academicReputation: "학설과 이론을 중시하는 학구적 성향이 두드러집니다.",
  clinicalTrust: "현장에서 직접 부딪히며 배우는 실전 성향이 강합니다.",
  textUnderstanding: "의서를 깊이 탐독하고 정리하는 문헌파 성향이 뚜렷합니다.",
  publicFavor: "백성과 가까운 곳에서 의술을 실천하는 인술파 성향입니다."
};

function getTopKey(scores) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
}

export default function ProgressPage({ game }) {
  const { history, scores, gameMeta, currentStageIndex, stages, closeProgress } = game;
  const topKey = getTopKey(scores);

  return (
    <main className="page progress-page">
      <h1>당신은 어떤 의원이 되어가고 있는가</h1>
      <p className="progress-subtitle">
        {currentStageIndex + 1} / {stages.length} 시대를 통과했습니다.
      </p>

      <section className="progress-tendency">
        <div className="tendency-name">{TENDENCY_NAMES[topKey]}</div>
        <p className="tendency-comment">{TENDENCY_COMMENTS[topKey]}</p>
      </section>

      <section className="progress-scores-section">
        <h2>현재 성향 분포</h2>
        <ScoreBarGroup scores={scores} labels={gameMeta.scoreLabels} />
      </section>

      <section className="progress-history-section">
        <h2>시대별 선택 기록</h2>
        {history.length === 0 ? (
          <p>아직 선택한 기록이 없습니다.</p>
        ) : (
          <div className="progress-timeline">
            {history.map((item, idx) => (
              <div key={`${idx}-${item.stageId}-${item.choiceId}`} className="timeline-item">
                <div className="timeline-stage">{item.stageTitle}</div>
                <div className="timeline-choice">{item.choiceTitle}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="button-group">
        <button onClick={closeProgress}>계속 진행하기</button>
      </div>
    </main>
  );
}
