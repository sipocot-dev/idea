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
          <span className="category-legend-marker" style={{ backgroundColor: group.color }}>{group.icon}</span>
          <span className="category-legend-copy"><strong>{group.name}</strong><small>{group.examples}</small></span>
          <span className="category-legend-dot" style={{ backgroundColor: group.color }} />
        </div>)}
      </div>}
      <div className="category-legend-foot">Illustrative category colors. Administrators can manage proposal categories in the admin area.</div>
    </section>
  );
}
