import React, { useState, useRef, useEffect, useMemo } from "react";
import glossaryData from "../../data/glossary.json";

export default function GlossaryTooltip({ termId, children }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef(null);
  const tooltipRef = useRef(null);

  const term = useMemo(() => {
    return glossaryData.terms.find((t) => t.id === termId);
  }, [termId]);

  useEffect(() => {
    if (visible && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const tooltipWidth = 320;
      let left = rect.left + rect.width / 2 - tooltipWidth / 2;
      if (left < 8) left = 8;
      if (left + tooltipWidth > window.innerWidth - 8) {
        left = window.innerWidth - tooltipWidth - 8;
      }
      const top = rect.bottom + 8;
      setPosition({ top, left });
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current && !wrapperRef.current.contains(e.target) &&
        tooltipRef.current && !tooltipRef.current.contains(e.target)
      ) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible]);

  if (!term) return <>{children}</>;

  return (
    <>
      <span
        ref={wrapperRef}
        className="glossary-trigger"
        onClick={() => setVisible((v) => !v)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </span>

      {visible && (
        <div
          ref={tooltipRef}
          className="glossary-tooltip"
          style={{ top: position.top, left: position.left }}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
        >
          <div className="glossary-tooltip-header">
            <span className="glossary-tooltip-term">{term.term}</span>
            <span className="glossary-tooltip-reading">{term.reading}</span>
            <span className="glossary-tooltip-category">{term.category}</span>
          </div>
          <p className="glossary-tooltip-definition">{term.definition}</p>
          {term.detail && (
            <p className="glossary-tooltip-detail">{term.detail}</p>
          )}
        </div>
      )}
    </>
  );
}
