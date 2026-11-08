# API Plan

Base path: /api/v1. JSON responses, consistent errors, bounded pagination, and role-aware schemas. Public APIs expose published records only.

## Public
| Method | Route | Purpose |
|---|---|---|
| GET | /ideas | Browse/search/filter public proposals |
| GET | /ideas/:slug | Public proposal detail |
| GET | /categories | Active categories |
| GET | /statuses | Status legend |
| GET | /departments | Public departments |
| GET | /barangays | Barangays |
| GET | /statistics | Public aggregates |

## Authenticated
| Method | Route | Purpose |
|---|---|---|
| POST | /ideas | Create draft |
| PATCH | /ideas/:id | Edit own draft/revision |
| POST | /ideas/:id/submit | Submit proposal |
| GET | /me/ideas | Own proposals |
| POST | /ideas/:id/support | Endorse |
| DELETE | /ideas/:id/support | Remove endorsement |
| POST | /ideas/:id/comments | Comment |
| POST | /uploads/presign | Request constrained upload URL |

## Administration
| Method | Route | Purpose |
|---|---|---|
| GET | /admin/ideas | Review queue |
| GET | /admin/ideas/:id | Administrative detail |
| PATCH | /admin/ideas/:id/status | Status transition |
| POST | /admin/ideas/:id/assignments | Assign reviewer/department |
| POST | /admin/ideas/:id/reviews | Evaluation |
| POST | /admin/ideas/:id/notes | Internal note |
| POST | /admin/ideas/:id/response | Publish department response |
| GET | /admin/reports | Reports |
| CRUD | /admin/categories | Category management |
| CRUD | /admin/departments | Department management |
| GET | /admin/audit-logs | Audit history |

## Status transition example
```json
{ "status": "under_review", "remarks": "Initial evaluation started.", "visibility": "public" }
```
Actor identity comes from the server session. Never accept actor IDs from client payloads. Validate allowed transitions on the server and write history/audit atomically.

Error envelope:
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid fields.", "details": [] } }
```
Use 400, 401, 403, 404, 409, 413, 429, and 500 appropriately. Version an OpenAPI 3 file at openapi/openapi.yaml and render Swagger UI at /docs.
