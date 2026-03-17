import React, { useEffect, useState } from "react";

export default function AchievementToast({ achievements, onDismiss }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!achievements || achievements.length === 0) return;
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [achievements, onDismiss]);

  if (!achievements || achievements.length === 0) return null;

  return (
    <div
      className={`achievement-toast-container ${visible ? "visible" : "hiding"}`}
      onClick={() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }}
    >
      {achievements.map((a) => (
        <div key={a.id} className="achievement-toast">
          <span className="achievement-toast-icon">{a.icon}</span>
          <div className="achievement-toast-text">
            <strong>{a.title}</strong>
            <span>{a.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
