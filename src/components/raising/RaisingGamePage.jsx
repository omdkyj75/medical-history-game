import React, { useEffect } from "react";
import ActivitySelectScreen from "./ActivitySelectScreen";
import ActivityResultScreen from "./ActivityResultScreen";
import EventScreen from "./EventScreen";
import EraTransitionScreen from "./EraTransitionScreen";
import DeadScreen from "./DeadScreen";
import BossEventScreen from "./BossEventScreen";
import PressureScreen from "./PressureScreen";
import NpcEventModal from "./NpcEventModal";
import MuteButton from "./MuteButton";

// 미니게임 8종
import PulseGame from "./minigames/PulseGame";
import HerbSortGame from "./minigames/HerbSortGame";
import PatientGame from "./minigames/PatientGame";
import YinYangGame from "./minigames/YinYangGame";
import MeridianGame from "./minigames/MeridianGame";
import FourDiagGame from "./minigames/FourDiagGame";
import HistoryQuizGame from "./minigames/HistoryQuizGame";
import EightPrinciplesGame from "./minigames/EightPrinciplesGame";

import { startBgm, stopBgm, sfxStatUp, sfxEvent, sfxEraTransition, sfxNpcEvent, resumeAudio } from "../../utils/audioManager";

const MINIGAME_COMPONENTS = {
  pulse: PulseGame,
  herb: HerbSortGame,
  patient: PatientGame,
  yinyang: YinYangGame,
  meridian: MeridianGame,
  fourdiag: FourDiagGame,
  history: HistoryQuizGame,
  eightprinciples: EightPrinciplesGame
};

export default function RaisingGamePage({ game }) {
  const { phase } = game;

  useEffect(() => {
    const handler = () => resumeAudio();
    document.addEventListener("click", handler, { once: true });
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    if (phase === "activity-select" && game.currentSeason) {
      startBgm(game.currentSeason.id);
    }
    return () => stopBgm();
  }, [game.currentSeason?.id, phase]);

  useEffect(() => {
    if (phase === "activity-result") sfxStatUp();
    if (phase === "event") sfxEvent();
    if (phase === "era-transition") sfxEraTransition();
  }, [phase]);

  useEffect(() => {
    if (game.pendingNpcEvent) sfxNpcEvent();
  }, [game.pendingNpcEvent]);

  const MinigameComponent = phase === "minigame" ? MINIGAME_COMPONENTS[game.minigameType] : null;

  return (
    <div className="page raising-page">
      <MuteButton />

      {phase === "activity-select" && <ActivitySelectScreen game={game} />}
      {phase === "activity-result" && <ActivityResultScreen game={game} />}
      {phase === "event" && <EventScreen game={game} />}
      {phase === "era-transition" && <EraTransitionScreen game={game} />}
      {phase === "dead" && <DeadScreen game={game} />}
      {phase === "boss-event" && <BossEventScreen game={game} />}
      {phase === "pressure" && <PressureScreen game={game} />}
      {phase === "minigame" && MinigameComponent && (
        <MinigameComponent onComplete={game.completeMinigame} />
      )}

      {game.pendingNpcEvent && (
        <NpcEventModal
          npc={game.pendingNpcEvent.npc}
          event={game.pendingNpcEvent.event}
          onClose={game.dismissNpcEvent}
        />
      )}
    </div>
  );
}
