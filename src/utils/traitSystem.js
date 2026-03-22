// 빌드 조합 보상 — 특정 스탯 조합 달성 시 패시브 trait 해금

const TRAITS = [
  {
    id: "medical-prodigy",
    name: "명의의 싹",
    hanja: "良醫之芽",
    condition: { medical: 15, knowledge: 10 },
    effect: "진료수련 시 의술 +1 추가",
    applyTo: "clinical-practice",
    bonus: { medical: 1 }
  },
  {
    id: "virtuous-name",
    name: "청렴한 의원",
    hanja: "淸廉醫員",
    condition: { virtue: 15, reputation: 10 },
    effect: "이벤트에서 명성 손실 절반",
    passive: "reputation-protect"
  },
  {
    id: "field-survivor",
    name: "현장형 실천가",
    hanja: "現場實踐家",
    condition: { medical: 12, stamina: 12 },
    effect: "체력 0 직전 1회 생존 (체력 3 회복)",
    passive: "stamina-save"
  },
  {
    id: "book-master",
    name: "문헌 집대성가",
    hanja: "文獻集大成家",
    condition: { knowledge: 18 },
    effect: "경전공부/학술교류 학식 +1 추가",
    applyTo: ["study-classics", "academic-exchange"],
    bonus: { knowledge: 1 }
  },
  {
    id: "herb-expert",
    name: "본초 달인",
    hanja: "本草達人",
    condition: { medical: 10 },
    effect: "약초채집 시 의술 +1 추가",
    applyTo: "herb-gathering",
    bonus: { medical: 1 }
  },
  {
    id: "peoples-doctor",
    name: "백성의 벗",
    hanja: "百姓之友",
    condition: { virtue: 12, reputation: 8 },
    effect: "민간봉사 시 명성 +1 추가",
    applyTo: "public-service",
    bonus: { reputation: 1 }
  },
  {
    id: "four-virtues",
    name: "사덕겸비",
    hanja: "四德兼備",
    condition: { medical: 20, knowledge: 20, virtue: 20, reputation: 20 },
    effect: "모든 행동 효율 +1",
    applyTo: "all",
    bonus: { medical: 1 }
  }
];

export function checkTraits(stats) {
  return TRAITS.filter((trait) => {
    return Object.entries(trait.condition).every(
      ([key, threshold]) => (stats[key] || 0) >= threshold
    );
  });
}

export function getTraitBonus(traits, activityId) {
  const bonus = {};
  for (const trait of traits) {
    if (!trait.bonus) continue;
    const applies =
      trait.applyTo === "all" ||
      trait.applyTo === activityId ||
      (Array.isArray(trait.applyTo) && trait.applyTo.includes(activityId));
    if (applies) {
      for (const [key, val] of Object.entries(trait.bonus)) {
        bonus[key] = (bonus[key] || 0) + val;
      }
    }
  }
  return bonus;
}

export function hasStaminaSave(traits) {
  return traits.some((t) => t.passive === "stamina-save");
}

export { TRAITS };
