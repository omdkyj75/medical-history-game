import React from "react";
import NpcPixelPortrait, { ERA_PALETTES } from "./NpcPixelPortrait";

export default function NpcPanel({ npcs, affinities }) {
  if (!npcs || npcs.length === 0) return null;

  return (
    <div className="npc-panel">
      <div className="npc-panel-title">이 시대의 인물</div>
      <div className="npc-list">
        {npcs.map((npc) => {
          const affinity = affinities[npc.id] || 0;
          const maxAffinity = npc.bonusEvent?.threshold || 10;
          const unlocked = affinity >= maxAffinity;
          const palette = ERA_PALETTES[npc.era] || ERA_PALETTES["ancient-origins"];

          // B2: 5칸 도트 게이지 계산
          const totalSlots = 5;
          const filledSlots = Math.min(totalSlots, Math.round((affinity / maxAffinity) * totalSlots));
          const nearUnlock = !unlocked && filledSlots >= totalSlots - 1;

          return (
            <div
              key={npc.id}
              className={`npc-card ${unlocked ? "npc-unlocked" : ""}`}
              style={{
                borderColor: palette.primary,
                background: palette.bg
              }}
            >
              {/* B1: 픽셀 초상화 */}
              <NpcPixelPortrait
                npcId={npc.id}
                era={npc.era}
                affinity={affinity}
                threshold={maxAffinity}
                size={40}
              />
              <div className="npc-info">
                <div className="npc-name">{npc.name}</div>
                <div className="npc-title-text">{npc.title}</div>
                {/* B2: 도트 게이지 */}
                <div className="npc-pixel-gauge">
                  {Array.from({ length: totalSlots }, (_, i) => (
                    <div
                      key={i}
                      className={`npc-gauge-slot ${i < filledSlots ? "filled" : ""} ${nearUnlock && i === filledSlots - 1 ? "near-unlock" : ""}`}
                      style={{
                        backgroundColor: i < filledSlots ? palette.accent : "rgba(255,255,255,0.1)",
                        borderColor: palette.primary
                      }}
                    />
                  ))}
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
