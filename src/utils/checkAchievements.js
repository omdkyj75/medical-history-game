import achievementsData from "../data/achievements.json";

const STORAGE_KEY = "medical-history-achievements";
const COMBO_IDS = ["systematizer", "field-healer", "theory-practice"];

function getUnlockedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUnlockedIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export function checkNewAchievements(currentResult, allResults) {
  const unlockedIds = getUnlockedIds();
  const newlyUnlocked = [];

  for (const achievement of achievementsData.achievements) {
    if (unlockedIds.includes(achievement.id)) continue;

    const { condition } = achievement;
    let met = false;

    switch (condition.type) {
      case "play-count":
        met = allResults.length >= condition.count;
        break;

      case "unique-results": {
        const uniqueIds = new Set(allResults.map((r) => r.resultId));
        met = uniqueIds.size >= condition.count;
        break;
      }

      case "specific-result":
        met = allResults.some((r) => r.resultId === condition.resultId);
        break;

      case "combo-ending":
        met = allResults.some((r) => COMBO_IDS.includes(r.resultId));
        break;

      case "max-score":
        met = Object.values(currentResult.scores).some(
          (v) => v >= condition.threshold
        );
        break;

      case "min-score":
        met = Object.values(currentResult.scores).some(
          (v) => v <= condition.threshold
        );
        break;
    }

    if (met) {
      newlyUnlocked.push(achievement);
    }
  }

  if (newlyUnlocked.length > 0) {
    const updatedIds = [...unlockedIds, ...newlyUnlocked.map((a) => a.id)];
    saveUnlockedIds(updatedIds);
  }

  return newlyUnlocked;
}

export function getAllAchievements() {
  const unlockedIds = getUnlockedIds();
  return achievementsData.achievements.map((a) => ({
    ...a,
    unlocked: unlockedIds.includes(a.id)
  }));
}

export function clearAchievements() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
