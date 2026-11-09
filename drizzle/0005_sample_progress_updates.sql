INSERT INTO idea_progress_updates (idea_id, author_id, title, body, percent_complete, milestone, visibility)
SELECT i.id, i.proposer_id, sample.title, sample.body, sample.percent, sample.milestone, 'public'
FROM (VALUES
 ('BS-2026-DEMO-001','[SAMPLE] Initial community mapping', 'Illustrative sample update: barangay connectivity needs are being collected and the pilot locations are being validated with community representatives.', 15, 'Needs assessment'),
 ('BS-2026-DEMO-002','[SAMPLE] Farmer group consultation', 'Illustrative sample update: the initial coordination workflow is being reviewed with farmer groups and local market participants.', 20, 'Stakeholder consultation'),
 ('BS-2026-DEMO-003','[SAMPLE] Priority school zones identified', 'Illustrative sample update: a preliminary list of school approaches has been prepared for validation with school and barangay representatives.', 35, 'Site assessment'),
 ('BS-2026-DEMO-004','[SAMPLE] Pilot waste-segregation planning', 'Illustrative sample update: participating households and collection points are being identified before the pilot begins.', 10, 'Pilot preparation')
) AS sample(public_id,title,body,percent,milestone)
JOIN ideas i ON i.public_id=sample.public_id
WHERE NOT EXISTS (SELECT 1 FROM idea_progress_updates p WHERE p.idea_id=i.id);
