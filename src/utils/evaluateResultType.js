function getScoreRange(scores) {
  const values = Object.values(scores);
  return Math.max(...values) - Math.min(...values);
}

function isTopScore(scores, key) {
  const max = Math.max(...Object.values(scores));
  return scores[key] === max;
}

function hasPreferredSecondaryStrength(scores, secondaryPreferred) {
  if (!secondaryPreferred || secondaryPreferred.length === 0) return true;

  const values = Object.values(scores).sort((a, b) => b - a);
  const second = values[1] ?? values[0];

  return secondaryPreferred.some((key) => scores[key] >= second);
}

function resolveTieByPriority(scores, candidatePrimaryKeys, scorePriorityOrder) {
  const max = Math.max(...candidatePrimaryKeys.map((key) => scores[key]));
  const tied = candidatePrimaryKeys.filter((key) => scores[key] === max);

  for (const priorityKey of scorePriorityOrder) {
    if (tied.includes(priorityKey)) {
      return priorityKey;
    }
  }

  return tied[0];
}

export function evaluateResultType(scores, resultTypesData) {
  const { resultTypes, scorePriorityOrder } = resultTypesData;

  const balancedType = resultTypes.find((type) => type.rule.type === "range");
  if (
    balancedType &&
    typeof balancedType.rule.maxMinusMinLte === "number" &&
    getScoreRange(scores) <= balancedType.rule.maxMinusMinLte
  ) {
    return balancedType;
  }

  const topScoreTypes = resultTypes
    .filter((type) => type.rule.type === "top-score")
    .sort((a, b) => a.priority - b.priority);

  const matchedCandidates = topScoreTypes.filter((type) => {
    const primary = type.rule.primary;
    if (!isTopScore(scores, primary)) return false;
    return hasPreferredSecondaryStrength(scores, type.rule.secondaryPreferred);
  });

  if (matchedCandidates.length === 1) {
    return matchedCandidates[0];
  }

  if (matchedCandidates.length > 1) {
    const primaryKeys = matchedCandidates.map((type) => type.rule.primary);
    const resolvedPrimary = resolveTieByPriority(
      scores,
      primaryKeys,
      scorePriorityOrder
    );

    return (
      matchedCandidates.find((type) => type.rule.primary === resolvedPrimary) ||
      matchedCandidates[0]
    );
  }

  const topValue = Math.max(...Object.values(scores));
  const topKeys = Object.keys(scores).filter((key) => scores[key] === topValue);

  const forcedPrimary = resolveTieByPriority(
    scores,
    topKeys,
    scorePriorityOrder
  );

  const fallbackMap = {
    academicReputation: "classic-research",
    textUnderstanding: "text-compilation",
    clinicalTrust: "clinical-practice",
    publicFavor: "medical-ethics-public"
  };

  return (
    resultTypes.find((type) => type.id === fallbackMap[forcedPrimary]) ||
    resultTypes[0]
  );
}
