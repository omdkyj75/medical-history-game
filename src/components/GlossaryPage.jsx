import React, { useState, useMemo } from "react";
import glossaryData from "../data/glossary.json";

const CATEGORIES = [
  "전체", "기초이론", "진단/치료", "본초학", "방제학", "학파",
  "병증", "병인론", "의학사", "체질의학", "진단학", "의료윤리", "예방의학"
];

const ERA_LABELS = {
  "ancient-origins": "상고시대",
  "warring-states": "전국시대",
  "qin-han": "진한시대",
  "wei-jin-sui-tang": "위진·수당",
  "song": "송대",
  "jin-yuan": "금원시대",
  "ming": "명대",
  "qing": "청대",
  "goryeo-joseon": "고려·조선",
  "joseon": "조선",
  "modern": "근현대"
};

export default function GlossaryPage({ onBack }) {
  const [filterCat, setFilterCat] = useState("전체");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const allTerms = glossaryData.terms;

  const filteredTerms = useMemo(() => {
    let result = allTerms;
    if (filterCat !== "전체") {
      result = result.filter((t) => t.category === filterCat);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.reading.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allTerms, filterCat, search]);

  return (
    <div className="glossary-page">
      <div className="glossary-page-header">
        <button className="btn-secondary" onClick={onBack}>← 돌아가기</button>
        <h2 className="glossary-page-title">용어 사전</h2>
        <span className="glossary-page-count">{filteredTerms.length}개 용어</span>
      </div>

      <div className="glossary-page-search">
        <input
          type="text"
          className="glossary-search-input"
          placeholder="용어 검색 (한글, 한자, 읽기)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="glossary-page-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`glossary-filter-btn ${filterCat === cat ? "active" : ""}`}
            onClick={() => setFilterCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="glossary-term-list">
        {filteredTerms.length === 0 && (
          <div className="glossary-empty">검색 결과가 없습니다.</div>
        )}
        {filteredTerms.map((term) => {
          const isExpanded = expandedId === term.id;
          return (
            <div key={term.id} className="glossary-term-item">
              <button
                className={`glossary-term-header ${isExpanded ? "expanded" : ""}`}
                onClick={() => setExpandedId(isExpanded ? null : term.id)}
              >
                <div className="glossary-term-main">
                  <span className="glossary-term-name">{term.term}</span>
                  <span className="glossary-term-reading">{term.reading}</span>
                </div>
                <div className="glossary-term-def">{term.definition}</div>
                <span className="glossary-term-expand-icon">{isExpanded ? "▲" : "▼"}</span>
              </button>

              {isExpanded && (
                <div className="glossary-term-detail">
                  {term.detail && (
                    <div className="glossary-term-detail-section">
                      <h4>상세 설명</h4>
                      <p>{term.detail}</p>
                    </div>
                  )}

                  {term.relatedTexts && term.relatedTexts.length > 0 && (
                    <div className="glossary-term-detail-section">
                      <h4>관련 의서</h4>
                      <div className="glossary-term-tags">
                        {term.relatedTexts.map((textId) => (
                          <span key={textId} className="glossary-term-tag">{textId}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="glossary-term-detail-section">
                    <h4>시대</h4>
                    <span className="glossary-term-era">
                      {ERA_LABELS[term.era] || term.era}
                    </span>
                  </div>

                  <div className="glossary-term-detail-section">
                    <h4>분류</h4>
                    <span className="glossary-term-cat-badge">{term.category}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
