import React from "react";
export default function FinalResultPage({ game }) {
  const { finalResult, scores, history, restartGame, goToStart, gameMeta } = game;

  if (!finalResult) return null;

  return (
    <main className="page final-page">
      <h1>당신의 의원 성장 결과</h1>
      <p>7개 시대를 모두 통과했습니다.</p>

      <section>
        <h2>최종 점수</h2>
        <ul>
          <li>{gameMeta.scoreLabels.academicReputation}: {scores.academicReputation}</li>
          <li>{gameMeta.scoreLabels.clinicalTrust}: {scores.clinicalTrust}</li>
          <li>{gameMeta.scoreLabels.textUnderstanding}: {scores.textUnderstanding}</li>
          <li>{gameMeta.scoreLabels.publicFavor}: {scores.publicFavor}</li>
        </ul>
      </section>

      <section>
        <h2>최종 의원 유형</h2>
        <h3>{finalResult.title}</h3>
        <p>{finalResult.longDescription}</p>
      </section>

      <section>
        <h2>시대별 선택 기록</h2>
        <ul>
          {history.map((item) => (
            <li key={`${item.stageId}-${item.choiceId}`}>
              <strong>{item.stageTitle}</strong>: {item.choiceTitle}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>학습 요약</h2>
        <p>
          이 결과는 정답이 아니라, 당신이 어떤 역사적 선택을 더 중시했는지를
          보여 줍니다. 시대에 따라 의학의 방향이 어떻게 달라졌는지 다시
          확인해 보십시오.
        </p>
      </section>

      <div className="button-group">
        <button onClick={restartGame}>다시 시작</button>
        <button onClick={goToStart}>처음으로 돌아가기</button>
      </div>
    </main>
  );
}
