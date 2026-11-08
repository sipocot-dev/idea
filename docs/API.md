# API

## Current endpoints
### GET /api/v1/ideas
Returns public proposal summaries. Optional query parameter:
- q — title search, maximum 100 characters.

### GET /api/health
Checks application database connectivity.

## Deferred endpoints
Upload presigning and attachment management endpoints are intentionally not implemented. They will be added with the final S3/media feature milestone.

## API standards
- Use JSON request/response bodies.
- Validate all inputs server-side.
- Require authentication and role checks for private or administrative operations.
- Apply rate limits to public and authenticated write operations.
- Keep public API responses free of private user information.
