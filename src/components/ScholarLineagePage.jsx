import React, { useState, useMemo } from "react";
import lineageData from "../data/scholarLineage.json";

const ERA_ORDER = [
  "ancient-origins", "warring-states", "qin-han", "wei-jin-sui-tang",
  "song", "jin-yuan", "ming", "qing", "goryeo-joseon", "joseon"
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
  "joseon": "조선"
};

export default function ScholarLineagePage({ encounteredScholars = [], onBack }) {
  const [selectedScholar, setSelectedScholar] = useState(null);

  const scholars = lineageData.scholars;
  const lineages = lineageData.lineages;

  const scholarMap = useMemo(() => {
    const map = {};
    scholars.forEach((s) => { map[s.id] = s; });
    return map;
  }, [scholars]);

  const lineageMap = useMemo(() => {
    const map = {};
    lineages.forEach((lin) => {
      lin.members.forEach((memberId) => {
        map[memberId] = lin;
      });
    });
    return map;
  }, [lineages]);

  const scholarsByEra = useMemo(() => {
    const grouped = {};
    scholars.forEach((s) => {
      if (!grouped[s.era]) grouped[s.era] = [];
      grouped[s.era].push(s);
    });
    return grouped;
  }, [scholars]);

  const isEncountered = (id) => encounteredScholars.includes(id);

  const getLineageStyle = (scholarId) => {
    const lin = lineageMap[scholarId];
    if (!lin) return {};
    return {
      borderLeft: `3px solid ${lin.color}`,
      backgroundColor: `${lin.color}15`
    };
  };

  return (
    <div className="scholar-page">
      <div className="scholar-page-header">
        <button className="btn-secondary" onClick={onBack}>← 돌아가기</button>
        <h2 className="scholar-page-title">인물 관계도 / 학맥도</h2>
        <span className="scholar-page-count">
          {encounteredScholars.length} / {scholars.length} 만남
        </span>
      </div>

      <div className="scholar-lineage-legend">
        {lineages.map((lin) => (
          <span key={lin.id} className="scholar-legend-item" style={{ borderColor: lin.color }}>
            <span className="scholar-legend-dot" style={{ background: lin.color }} />
            {lin.name}
          </span>
        ))}
      </div>

      <div className="scholar-era-list">
        {ERA_ORDER.map((eraId) => {
          const eraScholars = scholarsByEra[eraId];
          if (!eraScholars) return null;
          return (
            <div key={eraId} className="scholar-era-section">
              <div className="scholar-era-label">{ERA_LABELS[eraId] || eraId}</div>
              <div className="scholar-era-row">
                {eraScholars.map((scholar) => {
                  const encountered = isEncountered(scholar.id);
                  return (
                    <button
                      key={scholar.id}
                      className={`scholar-card ${encountered ? "encountered" : "hidden"}`}
                      style={encountered ? getLineageStyle(scholar.id) : {}}
                      onClick={() => encountered && setSelectedScholar(scholar)}
                    >
                      <span className="scholar-card-icon">
                        {encountered ? scholar.icon : "?"}
                      </span>
                      <div className="scholar-card-name">
                        {encountered ? scholar.name : "???"}
                      </div>
                      <div className="scholar-card-contribution">
                        {encountered
                          ? (scholar.contribution.length > 30
                              ? scholar.contribution.slice(0, 30) + "..."
                              : scholar.contribution)
                          : "???"}
                      </div>
                      {encountered && scholar.teacher && (
                        <div className="scholar-card-teacher">
                          스승: {scholar.teacher}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {selectedScholar && (
        <div className="scholar-detail-overlay" onClick={() => setSelectedScholar(null)}>
          <div className="scholar-detail" onClick={(e) => e.stopPropagation()}>
            <div className="scholar-detail-icon">{selectedScholar.icon}</div>
            <h3 className="scholar-detail-name">{selectedScholar.name}</h3>
            <p className="scholar-detail-meta">
              {selectedScholar.period} | {selectedScholar.role}
            </p>

            {lineageMap[selectedScholar.id] && (
              <span
                className="scholar-detail-school"
                style={{ borderColor: lineageMap[selectedScholar.id].color, color: lineageMap[selectedScholar.id].color }}
              >
                {lineageMap[selectedScholar.id].name}
              </span>
            )}

            <div className="scholar-detail-section">
              <h4>주요 공헌</h4>
              <p>{selectedScholar.contribution}</p>
            </div>

            {selectedScholar.teacher && (
              <div className="scholar-detail-section">
                <h4>스승</h4>
                <p>{selectedScholar.teacher}</p>
              </div>
            )}

            {selectedScholar.students && selectedScholar.students.length > 0 && (
              <div className="scholar-detail-section">
                <h4>제자</h4>
                <div className="scholar-detail-students">
                  {selectedScholar.students.map((stuId) => {
                    const stu = scholarMap[stuId];
                    return (
                      <span key={stuId} className="scholar-student-tag">
                        {stu ? stu.name : stuId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedScholar.texts && selectedScholar.texts.length > 0 && (
              <div className="scholar-detail-section">
                <h4>관련 의서</h4>
                <div className="scholar-detail-texts">
                  {selectedScholar.texts.map((textId) => (
                    <span key={textId} className="scholar-text-tag">{textId}</span>
                  ))}
                </div>
              </div>
            )}

            <button className="btn-primary" onClick={() => setSelectedScholar(null)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
