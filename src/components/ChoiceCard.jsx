import React from "react";
export default function ChoiceCard({ choice, onSelect }) {
  return (
    <article className="choice-card">
      <h3>{choice.title}</h3>
      <p><strong>대표 인물:</strong> {choice.figure}</p>
      <p><strong>대표 문헌:</strong> {choice.book}</p>
      <p><strong>대표 개념:</strong> {choice.concept}</p>
      <button onClick={onSelect}>이 길을 택한다</button>
    </article>
  );
}
