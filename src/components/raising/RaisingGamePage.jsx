import React from "react";
import ActivitySelectScreen from "./ActivitySelectScreen";
import ActivityResultScreen from "./ActivityResultScreen";
import EventScreen from "./EventScreen";
import EraTransitionScreen from "./EraTransitionScreen";

export default function RaisingGamePage({ game }) {
  const { phase } = game;

  return (
    <div className="page raising-page">
      {phase === "activity-select" && <ActivitySelectScreen game={game} />}
      {phase === "activity-result" && <ActivityResultScreen game={game} />}
      {phase === "event" && <EventScreen game={game} />}
      {phase === "era-transition" && <EraTransitionScreen game={game} />}
    </div>
  );
}
