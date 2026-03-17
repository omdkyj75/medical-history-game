import React from "react";
import { useGameState } from "./hooks/useGameState";
import StartPage from "./components/StartPage";
import HowToPlayPage from "./components/HowToPlayPage";
import StagePage from "./components/StagePage";
import FinalResultPage from "./components/FinalResultPage";
import ResultModal from "./components/ResultModal";

export default function App() {
  const game = useGameState();

  return (
    <div className="app-shell">
      {game.screen === "start" && <StartPage game={game} />}
      {game.screen === "howToPlay" && <HowToPlayPage game={game} />}
      {game.screen === "stage" && <StagePage game={game} />}
      {game.screen === "final" && <FinalResultPage game={game} />}

      {game.isResultModalOpen && (
        <ResultModal
          result={game.selectedChoiceResult}
          onNext={game.goToNextStage}
          onViewProgress={game.goToProgress}
        />
      )}
    </div>
  );
}
