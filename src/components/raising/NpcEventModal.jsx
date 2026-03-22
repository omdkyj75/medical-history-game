import React from "react";
import NpcPixelPortrait from "./NpcPixelPortrait";

const STAT_LABELS = {
  medical: "의술", knowledge: "학식", virtue: "덕행",
  stamina: "체력", reputation: "명성"
};

export default function NpcEventModal({ npc, event, onClose }) {
  if (!npc || !event) return null;

  const deltaEntries = Object.entries(event.delta).filter(([, v]) => v !== 0);

  return (
    <div className="npc-event-overlay" onClick={onClose}>
      <div className="npc-dialog-box" onClick={(e) => e.stopPropagation()}>
        {/* B4: 도트 대화창 레이아웃 */}
        <div className="npc-dialog-badge">특별 이벤트</div>
        <div className="npc-dialog-content">
          <div className="npc-dialog-portrait">
            <NpcPixelPortrait
              npcId={npc.id}
              era={npc.era}
              affinity={999}
              threshold={1}
              size={64}
            />
            <div className="npc-dialog-portrait-name">{npc.name}</div>
          </div>
          <div className="npc-dialog-text-area">
            <h3 className="npc-dialog-title">{event.title}</h3>
            <p className="npc-dialog-desc">{event.description}</p>
            <div className="npc-dialog-rewards">
              {deltaEntries.map(([key, val]) => (
                <span key={key} className={`raising-delta-tag ${val > 0 ? "positive" : "negative"}`}>
                  {STAT_LABELS[key] || key} {val > 0 ? `+${val}` : val}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button className="npc-dialog-continue" onClick={onClose}>
          {">> 계속"}
        </button>
      </div>
    </div>
  );
}
