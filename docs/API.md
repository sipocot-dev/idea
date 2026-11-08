# API Plan

Base path: /api/v1

All APIs return JSON and use consistent error envelopes. Use cursor or page-based pagination with bounded page sizes. Public endpoints must return only published/public fields.

## Public endpoints

| Method | Route | Purpose |
|---|---|---|
| GET | /ideas | Browse public proposals |
| GET | /ideas/:slug | View public proposal |
| GET | /categories | List active categories |
| GET | /statuses | Status legend |
| GET | /departments | Public department list |
| GET | /barangays | List target barangays |
| GET | /statistics | Public aggregate statistics |

## Authenticated endpoints

| Method | Route | Purpose |
|---|---|---|
| POST | /ideas | Create draft |
| PATCH | /ideas/:id | Update own draft/revision |
| POST | /ideas/:id/submit | Submit proposal |
| GET | /me/ideas | List own proposals |
| POST | /ideas/:id/support | Endorse |
| DELETE | /ideas/:id/support | Remove endorsement |
| POST | /ideas/:id/comments | Add comment |
| POST | /uploads/presign | Request constrained upload URL |

## Administration endpoints

| Method | Route | Purpose |
|---|---|---|
| GET | /admin/ideas | Review queue |
| GET | /admin/ideas/:id | Administrative detail |
| PATCH | /admin/ideas/:id/status | Change status |
| POST | /admin/ideas/:id/assignments | Assign department/reviewer |
| POST | /admin/ideas/:id/reviews | Record evaluation |
| POST | /admin/ideas/:id/notes | Add internal note |
| POST | /admin/ideas/:id/response | Publish department response |
| GET | /admin/reports | Reports |
| CRUD | /admin/categories | Manage categories |
| CRUD | /admin/departments | Manage departments |
| GET | /admin/audit-logs | Audit records |

## Status endpoint payload

```json
{
  "status": "under_review",
  "remarks": "Initial evaluation started.",
  "visibility": "public"
}
```

The server determines the acting administrator from the authenticated session. Clients cannot set actor IDs or bypass transition rules.

## Error format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The proposal contains invalid fields.",
    "details": []
  }
}
```

Use appropriate HTTP status codes: 400 validation, 401 unauthenticated, 403 unauthorized, 404 not found, 409 conflict, 413 upload too large, 429 rate limited, and 500 unexpected error.

## OpenAPI

Keep the OpenAPI 3 document versioned in the repository (planned: openapi/openapi.yaml) and expose Swagger UI at /docs. Include schemas, pagination, security schemes, examples, and role requirements. Never publish secret-bearing or internal-only endpoints.
