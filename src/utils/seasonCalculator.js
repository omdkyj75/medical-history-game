// 31턴을 봄→여름→가을→겨울로 순환
const SEASONS = [
  { id: "spring", name: "봄", icon: "🌸", color: "#e8b4c8", bgGradient: "linear-gradient(180deg, #fce4ec 0%, #f5f2ec 100%)" },
  { id: "summer", name: "여름", icon: "☀️", color: "#f4a460", bgGradient: "linear-gradient(180deg, #fff8e1 0%, #f5f2ec 100%)" },
  { id: "autumn", name: "가을", icon: "🍂", color: "#cd853f", bgGradient: "linear-gradient(180deg, #fff3e0 0%, #f5f2ec 100%)" },
  { id: "winter", name: "겨울", icon: "❄️", color: "#87ceeb", bgGradient: "linear-gradient(180deg, #e3f2fd 0%, #f5f2ec 100%)" }
];

export function getSeason(globalTurnNumber) {
  // 매 턴마다 계절 순환 (대략 8턴에 1주기)
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
