import React from "react";
import { useRaisingGameState } from "./hooks/useRaisingGameState";
import StartPage from "./components/StartPage";
import HowToPlayPage from "./components/HowToPlayPage";
import RaisingGamePage from "./components/raising/RaisingGamePage";
import FinalResultPage from "./components/FinalResultPage";
import HistoryPage from "./components/HistoryPage";
import AchievementPage from "./components/AchievementPage";
import AchievementToast from "./components/AchievementToast";
import MedicalTextCollection from "./components/raising/MedicalTextCollection";
import ScholarLineagePage from "./components/ScholarLineagePage";
import GlossaryPage from "./components/GlossaryPage";

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
      {game.screen === "collection" && (
        <MedicalTextCollection
          collectedTexts={game.collectedTexts}
          onClose={game.goToStart}
        />
      )}
      {game.screen === "lineage" && (
        <ScholarLineagePage
          encounteredScholars={game.encounteredScholars}
          onBack={game.goToStart}
        />
      )}
      {game.screen === "glossary" && (
        <GlossaryPage onBack={game.goToStart} />
      )}

      <footer className="app-footer">
        <a href="https://www.instagram.com/hooonnam" target="_blank" rel="noopener noreferrer">ig</a>
        <span className="app-footer-dot">·</span>
        <a href="https://github.com/hooonnam" target="_blank" rel="noopener noreferrer">gh</a>
      </footer>

      {game.newAchievements.length > 0 && (
        <AchievementToast
          achievements={game.newAchievements}
          onDismiss={game.dismissAchievements}
        />
      )}
    </div>
  );
}
