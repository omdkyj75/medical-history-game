import React from "react";

export default function NpcPanel({ npcs, affinities }) {
  if (!npcs || npcs.length === 0) return null;

  return (
    <div className="npc-panel">
      <div className="npc-panel-title">이 시대의 인물</div>
      <div className="npc-list">
        {npcs.map((npc) => {
          const affinity = affinities[npc.id] || 0;
          const maxAffinity = npc.bonusEvent?.threshold || 10;
          const pct = Math.min(100, (affinity / maxAffinity) * 100);
          const unlocked = affinity >= maxAffinity;

          return (
            <div key={npc.id} className={`npc-card ${unlocked ? "npc-unlocked" : ""}`}>
              <div className="npc-emoji">{npc.emoji}</div>
              <div className="npc-info">
                <div className="npc-name">{npc.name}</div>
                <div className="npc-title-text">{npc.title}</div>
                <div className="npc-affinity-bar-track">
                  <div
                    className="npc-affinity-bar-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {unlocked && (
                  <div className="npc-unlocked-badge">특별 이벤트 해금!</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
