"use client";

import { useState } from "react";

const groups = [
  { name: "Infrastructure", color: "#ef4444", icon: "🏗️", examples: "Roads, bridges, drainage, public facilities" },
  { name: "Education", color: "#3b82f6", icon: "🎓", examples: "Schools, learning centers, scholarships, digital learning" },
  { name: "Healthcare", color: "#ec4899", icon: "🏥", examples: "Clinics, medical missions, health facilities" },
  { name: "Agriculture", color: "#65a30d", icon: "🌾", examples: "Irrigation, farm roads, livelihood, farming technology" },
  { name: "Environment", color: "#16a34a", icon: "🌱", examples: "Waste management, clean-up drives, reforestation" },
  { name: "Technology", color: "#8b5cf6", icon: "💻", examples: "Internet access, digital services, connectivity" },
  { name: "Tourism", color: "#d97706", icon: "🏞️", examples: "Tourism trails, heritage sites, cultural preservation" },
  { name: "Transportation", color: "#f97316", icon: "🚌", examples: "Public transport, traffic management, pedestrian safety" },
  { name: "Social Services", color: "#0891b2", icon: "🤝", examples: "Housing, senior citizens, youth, PWD services" },
  { name: "Economic Development", color: "#0f766e", icon: "📈", examples: "Livelihood, small businesses, cooperatives, local markets" },
];

export default function ProjectCategoryLegend({ compact = false }: { compact?: boolean }) {
  const [expanded, setExpanded] = useState(!compact);
  return (
    <section className={`category-legend card ${compact ? "category-legend-compact" : ""}`}>
      <button type="button" className="category-legend-heading" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
        <span><span className="category-legend-kicker">BETTERSIPOCOT · PROJECT MAP KEY</span><strong>Project category legend</strong><small>Color and icon guide for community proposals</small></span>
        <span className="category-legend-toggle">{expanded ? "Hide" : "View legend"} <span aria-hidden="true">{expanded ? "⌃" : "⌄"}</span></span>
      </button>
      {expanded && <div className="category-legend-grid">
        {groups.map((group) => <div className="category-legend-item" key={group.name}>
          <span className="category-legend-marker" style={{ backgroundColor: group.color }}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={group.name==="Environment"?"M12 21c-4-2-7-5-7-10 0-3 2-6 7-8 5 2 7 5 7 8 0 5-3 8-7 10Zm0-1V9m0 4 4-4m-4 7-4-4":group.name==="Infrastructure"?"M3 21h18M5 21V9l7-6 7 6v12M9 21v-7h6v7":group.name==="Education"?"M2 10 12 4l10 6-10 6L2 10Zm4 3v5c4 3 8 3 12 0v-5":group.name==="Healthcare"?"M12 21s-8-5-8-11a4 4 0 0 1 8-2 4 4 0 0 1 8 2c0 6-8 11-8 11Zm0-14v7m-3.5-3.5h7":group.name==="Agriculture"?"M3 20c1-9 6-14 17-16-1 11-6 16-17 16Zm0 0 11-11":group.name==="Technology"?"M4 5h16v12H4zM8 21h8m-4-4v4":group.name==="Tourism"?"M3 20 9 7l4 8 3-5 5 10H3Z":group.name==="Transportation"?"M5 17h14l-1-9H6l-1 9Zm2 0v3m10-3v3":group.name==="Social Services"?"M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8": "M3 20h18M5 17l5-5 4 3 6-8"}/></svg></span>
          <span className="category-legend-copy"><strong>{group.name}</strong><small>{group.examples}</small></span>
          <span className="category-legend-dot" style={{ backgroundColor: group.color }} />
        </div>)}
      </div>}
      <div className="category-legend-foot">Illustrative category colors. Administrators can manage proposal categories in the admin area.</div>
    </section>
  );
}
