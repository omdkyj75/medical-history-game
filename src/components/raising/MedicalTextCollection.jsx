import React, { useState, useMemo } from "react";
import textsData from "../../data/medicalTexts.json";

const CATEGORIES = ["전체", "기초이론", "본초학", "임상/방제", "진단학", "침구학", "종합의서", "학파이론", "온병학", "방제학", "본초/방제", "사상의학"];

export default function MedicalTextCollection({ collectedTexts = [], onClose }) {
  const [selectedText, setSelectedText] = useState(null);
  const [filterCat, setFilterCat] = useState("전체");

  const allTexts = textsData.texts;

  const filteredTexts = useMemo(() => {
    if (filterCat === "전체") return allTexts;
    return allTexts.filter((t) => t.category === filterCat);
  }, [allTexts, filterCat]);

  const isUnlocked = (id) => collectedTexts.includes(id);

  return (
    <div className="medtext-overlay" onClick={onClose}>
      <div className="medtext-container" onClick={(e) => e.stopPropagation()}>
        <div className="medtext-header">
          <h2 className="medtext-title">의서 도감</h2>
          <span className="medtext-count">
            {collectedTexts.length} / {allTexts.length} 수집
          </span>
          <button className="medtext-close" onClick={onClose}>✕</button>
        </div>

        <div className="medtext-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`medtext-filter-btn ${filterCat === cat ? "active" : ""}`}
              onClick={() => setFilterCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="medtext-grid">
          {filteredTexts.map((text) => {
            const unlocked = isUnlocked(text.id);
            return (
              <button
                key={text.id}
                className={`medtext-card ${unlocked ? "unlocked" : "locked"}`}
                onClick={() => unlocked && setSelectedText(text)}
              >
                <span className="medtext-card-icon">
                  {unlocked ? text.icon : "?"}
                </span>
                <div className="medtext-card-name">
                  {unlocked ? text.name : "???"}
                </div>
                <div className="medtext-card-meta">
                  {unlocked ? text.era : "???"}
                </div>
                <div className="medtext-card-author">
                  {unlocked ? text.author : "???"}
                </div>
                <div className="medtext-card-category">
                  {unlocked ? text.category : "???"}
                </div>
              </button>
            );
          })}
        </div>

        {selectedText && (
          <div className="medtext-detail-overlay" onClick={() => setSelectedText(null)}>
            <div className="medtext-detail" onClick={(e) => e.stopPropagation()}>
              <div className="medtext-detail-icon">{selectedText.icon}</div>
              <h3 className="medtext-detail-name">{selectedText.name}</h3>
              <p className="medtext-detail-meta">
                {selectedText.author} | {selectedText.period}
              </p>
              <span className="medtext-detail-category">{selectedText.category}</span>

              <div className="medtext-detail-section">
                <h4>설명</h4>
                <p>{selectedText.description}</p>
              </div>

              <div className="medtext-detail-section">
                <h4>역사적 의의</h4>
                <p>{selectedText.significance}</p>
              </div>

              <div className="medtext-detail-section">
                <h4>주요 내용</h4>
                <ul className="medtext-detail-contents">
                  {selectedText.keyContents.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="medtext-detail-section exam-tip">
                <h4>시험 출제 포인트</h4>
                <p>{selectedText.examTip}</p>
              </div>

              <button className="btn-primary" onClick={() => setSelectedText(null)}>
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
