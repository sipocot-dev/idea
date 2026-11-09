-- Clearly labeled BetterSipocot demonstration records.
-- Demo identities are intentionally inactive and cannot sign in.
INSERT INTO users (id, name, email, role, is_active)
VALUES
 ('demo-user-resident-001', 'Maria Santos (Sample Resident)', 'maria.sample@example.org', 'user', false),
 ('demo-user-youth-001', 'Juan Dela Cruz (Sample Youth Volunteer)', 'juan.sample@example.org', 'user', false),
 ('demo-user-teacher-001', 'Ana Reyes (Sample Teacher)', 'ana.sample@example.org', 'user', false),
 ('demo-user-farmer-001', 'Pedro Garcia (Sample Farmer)', 'pedro.sample@example.org', 'user', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO idea_categories (name, slug, description, display_order)
VALUES
 ('Infrastructure', 'infrastructure', 'Roads, drainage, connectivity, and public facilities', 1),
 ('Education', 'education', 'Schools, learning access, and digital literacy', 2),
 ('Healthcare', 'healthcare', 'Public health, prevention, and access to care', 3),
 ('Agriculture', 'agriculture', 'Farm productivity, markets, and livelihood', 4),
 ('Environment', 'environment', 'Waste reduction, climate resilience, and conservation', 5),
 ('Technology', 'technology', 'Digital public services and civic technology', 6),
 ('Tourism', 'tourism', 'Local tourism, culture, and heritage', 7),
 ('Transportation', 'transportation', 'Mobility, road safety, and public transport', 8)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO departments (name, slug)
VALUES
 ('Municipal Engineering Office', 'municipal-engineering'),
 ('Municipal Agriculture Office', 'municipal-agriculture'),
 ('Municipal Health Office', 'municipal-health'),
 ('Municipal Environment Office', 'municipal-environment'),
 ('Municipal Tourism Office', 'municipal-tourism'),
 ('Information and Communications Technology', 'ict')
ON CONFLICT (slug) DO NOTHING;

WITH sample_ideas (
 id, public_id, slug, proposer_id, title, type, category_slug, summary, description,
 problem_statement, proposed_solution, expected_benefits, target_barangay,
 department_slug, estimated_budget, status, is_open_source, willing_to_collaborate
) AS (
 VALUES
 ('10000000-0000-4000-8000-000000000001'::uuid, 'BS-2026-DEMO-001', 'sample-community-wifi-hotspots', 'demo-user-resident-001',
  '[SAMPLE] Community Wi-Fi and Digital Learning Hotspots', 'community_project'::proposal_type, 'technology',
  'Establish free, managed Wi-Fi zones in selected public spaces and learning centers.',
  E'## Overview\nProvide reliable public internet access at selected community facilities.\n\n## Proposed approach\n- Pilot at the municipal hall, public library, and selected barangay halls.\n- Apply content filtering, bandwidth limits, and fair-use policies.\n- Publish uptime and usage statistics without exposing personal data.\n\n## Pilot measures\nCoverage, uptime, active sessions, and learner feedback.',
  'Students and residents without reliable home internet have limited access to online learning and government services.',
  'Run a costed pilot with an ISP, install managed access points, and establish a maintenance and acceptable-use policy.',
  'Improved digital inclusion, access to learning resources, and easier access to online public services.',
  'Poblacion and pilot barangays', 'ict', 450000, 'submitted'::idea_status, true, true),

 ('10000000-0000-4000-8000-000000000002'::uuid, 'BS-2026-DEMO-002', 'sample-farm-to-market-produce-hub', 'demo-user-farmer-001',
  '[SAMPLE] Farm-to-Market Produce Coordination Hub', 'community_project'::proposal_type, 'agriculture',
  'Coordinate harvest schedules, consolidated transport, and local buyer information for small farmers.',
  E'## Overview\nCreate a simple coordination service for farmer groups and local buyers.\n\n## Features\n- Weekly harvest and volume reporting.\n- Shared transport scheduling.\n- Public directory of participating buyers and markets.\n- Optional SMS notices for farmers with limited connectivity.',
  'Small producers can face high transport costs, fragmented supply, and limited access to current market information.',
  'Pilot a cooperative-led produce calendar and shared logistics arrangement with transparent operating rules.',
  'Reduced post-harvest losses, improved market access, and stronger local agricultural livelihoods.',
  'Agricultural barangays', 'municipal-agriculture', 300000, 'under_review'::idea_status, false, true),

 ('10000000-0000-4000-8000-000000000003'::uuid, 'BS-2026-DEMO-003', 'sample-school-zone-road-safety', 'demo-user-youth-001',
  '[SAMPLE] Safer School Zones and Pedestrian Crossings', 'community_project'::proposal_type, 'transportation',
  'Improve pedestrian safety around schools through visible crossings, signage, and community-led road awareness.',
  E'## Overview\nIdentify high-risk school approaches and implement low-cost safety improvements.\n\n## Activities\n- Conduct walkability and traffic observations with schools.\n- Mark crossings and install warning signs where approved.\n- Coordinate crossing assistance during peak arrival and dismissal times.\n- Track near-miss reports and community feedback.',
  'Children and other pedestrians may be exposed to unsafe vehicle speeds and unclear crossing points near schools.',
  'Work with schools, barangays, and the engineering office to prioritize locations and implement an evaluated pilot.',
  'Safer school commutes, improved driver awareness, and safer walking routes.',
  'Barangays with public elementary and secondary schools', 'municipal-engineering', 250000, 'approved'::idea_status, true, true),

 ('10000000-0000-4000-8000-000000000004'::uuid, 'BS-2026-DEMO-004', 'sample-segregation-composting-program', 'demo-user-resident-001',
  '[SAMPLE] Barangay Waste Segregation and Community Composting', 'community_project'::proposal_type, 'environment',
  'Start a practical waste segregation and composting program with participating households and market vendors.',
  E'## Overview\nReduce mixed waste through source segregation, collection guidance, and shared composting.\n\n## Pilot components\n- Household and vendor orientation.\n- Clearly labeled collection points.\n- Composting of suitable biodegradable waste.\n- Monthly reporting of diverted waste and contamination rates.',
  'Mixed waste increases disposal costs and reduces the amount of biodegradable material that can be recovered locally.',
  'Begin with a small number of participating streets and a barangay-managed composting site subject to safety and environmental review.',
  'Cleaner public spaces, reduced residual waste, and compost for community gardens.',
  'One volunteer pilot barangay', 'municipal-environment', 180000, 'in_progress'::idea_status, false, true),

 ('10000000-0000-4000-8000-000000000005'::uuid, 'BS-2026-DEMO-005', 'sample-mobile-health-outreach-calendar', 'demo-user-teacher-001',
  '[SAMPLE] Public Health Outreach and Check-up Calendar', 'community_project'::proposal_type, 'healthcare',
  'Publish a barangay-level schedule of health outreach activities and basic preventive-care services.',
  E'## Overview\nMake outreach schedules easier to find and reduce missed community health activities.\n\n## Proposed features\n- Public calendar of approved outreach dates.\n- Service descriptions and eligibility guidance.\n- Reminder notices through barangay channels.\n- Aggregate attendance reporting only; no public patient records.',
  'Residents may miss outreach activities because schedules and service information are difficult to find.',
  'Coordinate a public schedule with the health office and barangay health workers, using existing communication channels.',
  'Improved awareness of preventive services and better participation in local health programs.',
  'All participating barangays', 'municipal-health', 90000, 'submitted'::idea_status, true, true),

 ('10000000-0000-4000-8000-000000000006'::uuid, 'BS-2026-DEMO-006', 'sample-local-heritage-trail', 'demo-user-youth-001',
  '[SAMPLE] Sipocot Local Heritage and Community Tourism Trail', 'idea'::proposal_type, 'tourism',
  'Create a community-reviewed directory and walking or driving trail of local heritage sites and stories.',
  E'## Overview\nDocument local heritage places, community stories, and visitor guidance with the consent of relevant custodians.\n\n## Deliverables\n- Verified site directory and map.\n- Short histories reviewed by local contributors.\n- Visitor etiquette and conservation guidance.\n- Accessible digital pages and printable materials.',
  'Local places and stories can be difficult for residents and visitors to discover through one reliable source.',
  'Work with schools, cultural groups, barangays, and site custodians to verify information before publication.',
  'Stronger local identity, educational resources, and responsible community tourism.',
  'Sipocot town center and participating barangays', 'municipal-tourism', 120000, 'submitted'::idea_status, true, true)
)
INSERT INTO ideas (
 id, public_id, slug, proposer_id, title, type, category_id, summary, description,
 problem_statement, proposed_solution, expected_benefits, target_barangay,
 department_id, estimated_budget, status, visibility, is_open_source, willing_to_collaborate,
 submitted_at
)
SELECT s.id, s.public_id, s.slug, s.proposer_id, s.title, s.type, c.id, s.summary, s.description,
 s.problem_statement, s.proposed_solution, s.expected_benefits, s.target_barangay,
 d.id, s.estimated_budget, s.status, 'public', s.is_open_source, s.willing_to_collaborate, now()
FROM sample_ideas s
JOIN idea_categories c ON c.slug = s.category_slug
LEFT JOIN departments d ON d.slug = s.department_slug
ON CONFLICT (id) DO NOTHING;
