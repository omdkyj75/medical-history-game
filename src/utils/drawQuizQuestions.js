import questionPool from "../data/questionPool.json";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function drawQuizQuestions() {
  const { stages, randomDrawRule } = questionPool;
  const { difficultyPick } = randomDrawRule;
  const result = [];

  for (const stage of stages) {
    const byDiff = {};
    for (const q of stage.questionPool) {
      (byDiff[q.difficulty] ??= []).push(q);
    }

    const picked = [];
    for (const [diff, count] of Object.entries(difficultyPick)) {
      const pool = shuffle(byDiff[diff] || []);
      picked.push(...pool.slice(0, count));
    }

    for (const q of shuffle(picked)) {
      // 보기 순서 랜덤화 + answerIndex 재계산
      const indices = q.options.map((_, i) => i);
      const shuffled = shuffle(indices);
      const newOptions = shuffled.map((i) => q.options[i]);
      const newAnswerIndex = shuffled.indexOf(q.answerIndex);
      result.push({
        ...q,
        options: newOptions,
        answerIndex: newAnswerIndex,
        stageId: stage.stageId,
        stageTitle: stage.stageTitle
      });
    }
  }

  return result;
}
