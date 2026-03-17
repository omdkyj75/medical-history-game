export default function ResultModal({ result, onNext, onViewProgress }) {
  if (!result) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>선택의 결과</h2>

        <p><strong>당신이 선택한 길</strong></p>
        <p>{result.choiceTitle}</p>

        <p><strong>대표 인물:</strong> {result.figure}</p>
        <p><strong>대표 문헌:</strong> {result.book}</p>
        <p><strong>대표 개념:</strong> {result.concept}</p>

        <div className="delta-box">
          <p><strong>점수 변화</strong></p>
          <ul>
            <li>學術名聲 +{result.delta.academicReputation}</li>
            <li>臨床信賴度 +{result.delta.clinicalTrust}</li>
            <li>文獻理解度 +{result.delta.textUnderstanding}</li>
            <li>百姓好感度 +{result.delta.publicFavor}</li>
          </ul>
        </div>

        <div className="commentary-box">
          <p><strong>역사 해설</strong></p>
          <p>{result.resultComment}</p>
        </div>

        <div className="button-group">
          <button onClick={onNext}>다음 시대로</button>
          <button onClick={onViewProgress}>현재까지 결과 보기</button>
        </div>
      </div>
    </div>
  );
}
