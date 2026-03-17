export default function ScorePanel({ scores, labels }) {
  return (
    <section className="score-panel">
      <h3>현재 성장 상태</h3>
      <ul>
        <li>{labels.academicReputation}: {scores.academicReputation}</li>
        <li>{labels.clinicalTrust}: {scores.clinicalTrust}</li>
        <li>{labels.textUnderstanding}: {scores.textUnderstanding}</li>
        <li>{labels.publicFavor}: {scores.publicFavor}</li>
      </ul>
    </section>
  );
}
