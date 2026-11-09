# BetterSipocot Ideas — Gamification Rules

Gamification rewards verified civic participation. It does not reward popularity, page views, repeated clicks, or self-promotion.

## Point awards

| Verified action | Points | Anti-abuse rule |
|---|---:|---|
| Submit a proposal | 10 | Awarded once per proposal ID; existing submission rate limit remains 5 per hour |
| Support a proposal | 1 | One award per user and proposal; users cannot support their own proposals; removing support does not refund or re-award points |
| Get accepted as a collaborator | 5 | One award per user and proposal; pending or declined requests earn nothing |
| Publish a progress update | 2 | Maximum 3 progress updates per user per 24 hours; update must belong to a proposal the user owns or is an accepted collaborator on |

All point events have a unique `(user_id, event_key)` key. Duplicate submissions, retries, repeated support toggles, and repeated collaboration decisions cannot create duplicate awards.

## Badges

| Badge | Qualification |
|---|---|
| Idea Starter | At least one proposal submission |
| Community Voice | At least one unique proposal support |
| Trusted Collaborator | At least one accepted collaboration |
| Community Builder | At least 25 verified impact points |

Badges are inserted once per user and badge key. Administrators must not manually award badges for unverified activity. A badge is permanent once awarded; points are an immutable ledger and are not deducted when a user withdraws support.

## Moderation and integrity

- Only active, authenticated users can perform point-earning actions.
- Proposal owners cannot support their own proposals.
- Only the proposal owner can accept or decline collaboration requests.
- Only proposal owners and accepted collaborators can publish progress updates.
- Administrative status changes create a public progress timeline entry using the review remarks.
- Page views, profile views, and raw traffic never award points.
