const STORAGE_KEY = "medical-history-results";
const MAX_RESULTS = 20;

export function saveResult({ playerName, finalResult, scores, history }) {
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    playerName: playerName || "익명",
    resultId: finalResult.id,
    nickname: finalResult.nickname,
    title: finalResult.title,
    subtitle: finalResult.subtitle,
    historicalMatch: finalResult.historicalMatch || null,
    scores: { ...scores },
    history: history.map((h) => ({
      eraTitle: h.eraTitle || h.stageTitle,
      activityId: h.activityId || null,
      activityTitle: h.activityTitle || h.choiceTitle,
      eventTitle: h.eventTitle || null,
      npcEventTitle: h.npcEventTitle || null,
      minigameType: h.minigameType || null,
      statsAfter: h.statsAfter || null
    })),
    timestamp: Date.now()
  };

  const existing = getResults();
  existing.unshift(entry);
  if (existing.length > MAX_RESULTS) existing.length = MAX_RESULTS;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // localStorage full or unavailable
  }

  return entry;
}

export function getResults() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearResults() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
