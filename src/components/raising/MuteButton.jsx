import React, { useState } from "react";
import { toggleMute, isMuted } from "../../utils/audioManager";

export default function MuteButton() {
  const [muted, setMuted] = useState(isMuted());

  function handleToggle() {
    const newMuted = toggleMute();
    setMuted(newMuted);
  }

  return (
    <button
      className="mute-btn"
      onClick={handleToggle}
      title={muted ? "소리 켜기" : "소리 끄기"}
    >
      {muted ? "OFF" : "ON"}
    </button>
  );
}
