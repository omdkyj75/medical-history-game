import React from "react";

const TENDENCY_SHORT = {
  academicReputation: "이론",
  clinicalTrust: "임상",
  textUnderstanding: "문헌",
  publicFavor: "민생"
};

function getTopTendency(delta) {
  let top = null;
  let max = -Infinity;
  for (const [key, val] of Object.entries(delta)) {
    if (val > max) { max = val; top = key; }
  }
  return top ? TENDENCY_SHORT[top] : null;
}

export default function ChoiceCard({ choice, onSelect }) {
  const badge = getTopTendency(choice.delta);

  return (
    <article className="choice-card" onClick={onSelect}>
      {badge && <span className="choice-card-badge">{badge}</span>}
      <h3>{choice.title}</h3>
      <p className="choice-card-meta">
        {choice.figure} · {choice.book} · {choice.concept}
      </p>
    </article>
  );
}
