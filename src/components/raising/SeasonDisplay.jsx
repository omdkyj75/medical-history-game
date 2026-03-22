import React from "react";

export default function SeasonDisplay({ season, seasonBonus }) {
  if (!season) return null;

  return (
    <div className="season-display" style={{ "--season-color": season.color }}>
      <span className="season-icon">{season.name === "봄" ? "春" : season.name === "여름" ? "夏" : season.name === "가을" ? "秋" : "冬"}</span>
      <span className="season-name">{season.name}</span>
      {seasonBonus?.desc && (
        <span className="season-bonus-text">{seasonBonus.desc}</span>
      )}
    </div>
  );
}
