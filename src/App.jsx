import React from "react";
import { useRaisingGameState } from "./hooks/useRaisingGameState";
import StartPage from "./components/StartPage";
import HowToPlayPage from "./components/HowToPlayPage";
import RaisingGamePage from "./components/raising/RaisingGamePage";
import FinalResultPage from "./components/FinalResultPage";
import HistoryPage from "./components/HistoryPage";
import AchievementPage from "./components/AchievementPage";
import AchievementToast from "./components/AchievementToast";
import QuizPage from "./components/QuizPage";

export default function App() {
  const game = useRaisingGameState();

  return (
    <div className="app-shell">
      {game.screen === "start" && <StartPage game={game} />}
      {game.screen === "howToPlay" && <HowToPlayPage game={game} />}
      {game.screen === "raising" && <RaisingGamePage game={game} />}
      {game.screen === "final" && <FinalResultPage game={game} />}
      {game.screen === "history" && <HistoryPage game={game} />}
      {game.screen === "achievements" && <AchievementPage game={game} />}
      {game.screen === "quiz" && <QuizPage game={game} />}

      {game.newAchievements.length > 0 && (
        <AchievementToast
          achievements={game.newAchievements}
          onDismiss={game.dismissAchievements}
        />
      )}
    </div>
  );
}
