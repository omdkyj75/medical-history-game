// 31턴을 봄→여름→가을→겨울로 순환
const SEASONS = [
  { id: "spring", name: "봄", color: "#ff6b9d", bgGradient: "linear-gradient(180deg, #1a1030 0%, #0f0f23 100%)" },
  { id: "summer", name: "여름", color: "#ffaa44", bgGradient: "linear-gradient(180deg, #1a1a10 0%, #0f0f23 100%)" },
  { id: "autumn", name: "가을", color: "#ff8a5c", bgGradient: "linear-gradient(180deg, #1a1018 0%, #0f0f23 100%)" },
  { id: "winter", name: "겨울", color: "#4ecdc4", bgGradient: "linear-gradient(180deg, #0f1a2a 0%, #0f0f23 100%)" }
];

export function getSeason(globalTurnNumber) {
  const seasonIndex = (globalTurnNumber - 1) % 4;
  return SEASONS[seasonIndex];
}

export function getSeasonBonus(seasonId) {
  switch (seasonId) {
    case "spring":
      return { activityId: "herb-gathering", bonus: { medical: 1 }, desc: "봄철 약초가 풍성합니다" };
    case "summer":
      return { activityId: null, penalty: { stamina: -1 }, desc: "무더위에 체력 소모가 큽니다" };
    case "autumn":
      return { activityId: "academic-exchange", bonus: { reputation: 1 }, desc: "가을 학술 교류가 활발합니다" };
    case "winter":
      return { activityId: "rest", bonus: { stamina: 1 }, desc: "겨울 휴식의 효과가 좋습니다" };
    default:
      return null;
  }
}

export { SEASONS };
