import achievementsData from "../data/achievements.json";

const STORAGE_KEY = "medical-history-achievements";
const COMBO_IDS = ["systematizer", "field-healer", "innovation-pioneer", "peoples-champion"];

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
  } catch {}
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

      case "max-stat": {
        const stat = condition.stat;
        const threshold = condition.threshold;
        met = currentResult.scores?.[stat] >= threshold;
        break;
      }

      case "max-score":
        met = Object.values(currentResult.scores || {}).some(
          (v) => v >= condition.threshold
        );
        break;

      case "min-score":
        met = Object.values(currentResult.scores || {}).some(
          (v) => v <= condition.threshold
        );
        break;

      case "stamina-zero":
        // 턴 기록 중 체력이 0이 된 적이 있는지
        met = (currentResult.history || []).some(
          (h) => h.statsAfter?.stamina <= 0
        );
        break;

      case "all-activities-used": {
        const usedActivities = new Set(
          (currentResult.history || []).map((h) => h.activityId || h.activityTitle)
        );
        met = usedActivities.size >= 7;
        break;
      }

      case "activity-count": {
        const counts = {};
        for (const h of (currentResult.history || [])) {
          const key = h.activityId || h.activityTitle;
          counts[key] = (counts[key] || 0) + 1;
        }
        met = Object.values(counts).some((c) => c >= condition.count);
        break;
      }

      case "never-activity": {
        const used = new Set(
          (currentResult.history || []).map((h) => h.activityId || h.activityTitle)
        );
        met = !used.has(condition.activityId);
        break;
      }
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
  } catch {}
}
