import React from "react";
import { useGameState } from "./hooks/useGameState";
import StartPage from "./components/StartPage";
import HowToPlayPage from "./components/HowToPlayPage";
import StagePage from "./components/StagePage";
import FinalResultPage from "./components/FinalResultPage";
import ProgressPage from "./components/ProgressPage";
import ResultModal from "./components/ResultModal";
import HistoryPage from "./components/HistoryPage";
import AchievementPage from "./components/AchievementPage";
import AchievementToast from "./components/AchievementToast";

export default function App() {
  const game = useGameState();

  return (
    <div className="app-shell">
      {game.screen === "start" && <StartPage game={game} />}
      {game.screen === "howToPlay" && <HowToPlayPage game={game} />}
      {game.screen === "stage" && <StagePage game={game} />}
      {game.screen === "final" && <FinalResultPage game={game} />}
      {game.screen === "progress" && <ProgressPage game={game} />}
      {game.screen === "history" && <HistoryPage game={game} />}
      {game.screen === "achievements" && <AchievementPage game={game} />}

      {game.isResultModalOpen && (
        <ResultModal
          result={game.selectedChoiceResult}
          onNext={game.goToNextStage}
          onViewProgress={game.goToProgress}
          gameMeta={game.gameMeta}
        />
      )}

      {game.newAchievements.length > 0 && (
        <AchievementToast
          achievements={game.newAchievements}
          onDismiss={game.dismissAchievements}
        />
      )}
    </div>
  );
}
