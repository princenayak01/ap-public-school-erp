# Security Audit — A. P. Public School ERP

**Scope:** Static source review of the `main` branch, focused on authentication, parent/student authorization, and tenant isolation.  
**Review date:** 2026-11-19  
**Status:** Critical findings identified. This is not a penetration test and does not certify the deployed environment.

## Executive summary

The current source must **not** be treated as safe for real student/parent data or multi-school SaaS use. Several code paths grant access without valid authentication or derive a parent's child access from caller-controlled identifiers. The Prisma schema currently models one school and has no tenant ownership key on core records. UI-only filtering cannot fix these problems.

## Findings

### CRITICAL — Missing bearer token is treated as an authenticated Principal
**File:** `backend/src/middleware/auth.middleware.ts`

When the Authorization header is missing, middleware assigns a hard-coded Principal identity and calls `next()`. Any route using this middleware can therefore receive a privileged Principal context without proving identity.

**Required fix:** Missing, malformed, expired, or invalid tokens must fail closed with HTTP 401. Never synthesize a privileged user in request middleware. Development/demo identities must be behind an explicit, non-production-only mechanism and must not be deployable to production.

### CRITICAL — Parent-to-student access can be selected using request query parameters
**File:** `backend/src/controllers/parent.controller.ts`

`getMyChildren` reads `phone` and `email` from query parameters before authenticated identity fields. It also contains a hard-coded `PARENT_WARD_MAP` keyed by phone numbers and email addresses and returns those student records directly. These are caller-controlled identifiers, not proof of a verified parent-child relationship.

**Required fix:** Derive parent identity only from a validated server-side session/JWT subject. Resolve the parent by `userId` and return only students linked through the database relationship. Remove all phone/email-based authorization and hard-coded parent/student maps.

### HIGH — Parent child-detail lookup trusts query identifiers
**File:** `backend/src/controllers/parent.controller.ts`

`getChildDetails` also accepts query phone/email values when resolving the parent. Parent authorization must be a database relation check scoped to the authenticated user's ID and requested student ID. Privileged school roles need a separate explicit authorization path.

### CRITICAL — Student-by-ID fallback can return an unrelated student
**File:** `backend/src/controllers/student.controller.ts`

The `getById` fallback uses the requested ID, but if it does not match, it returns `datastore.getStudents()[0]`. This can disclose a different student's record instead of returning 404/403. The controller also uses generic `Request` rather than an authenticated request and does not apply a visible per-user/tenant check in this method.

**Required fix:** Never fall back to the first record. Scope every lookup by authorized school and role; return 404 for absent/out-of-scope IDs to avoid record enumeration.

### CRITICAL — Demo/fallback authentication is present in application service
**File:** `backend/src/services/auth.service.ts`

The source contains hard-coded demo accounts and fixed passwords. OTP send/verify methods currently return success without performing verification. Database exceptions are caught broadly and can trigger fallback authentication. The datastore registration/login path compares a stored password directly with the submitted password.

**Required fix:** Remove production fallback credentials and fake OTP success. Store only strong password hashes; make OTP verification cryptographically/randomly generated, expiring, rate-limited, and one-time. A database outage must fail closed rather than silently switching to demo identities. Distinguish invalid credentials from infrastructure failures.

### HIGH — No tenant key in Prisma data model
**File:** `backend/prisma/schema.prisma`

The current schema has no `School` tenant model and no `schoolId` ownership field on `User`, `Student`, `Class`, `Section`, `Parent`, `Teacher`, fees, attendance, exams, reports, documents, notifications, or audit logs. Unique constraints such as email/admission number/class code are global rather than tenant-scoped.

**Required fix:** Introduce a `School` model and required tenant foreign keys; migrate existing A. P. Public School records to one explicitly created school tenant; replace global uniqueness with tenant-scoped compound uniqueness where appropriate; ensure every relationship cannot cross school boundaries. Backfill and validate before making tenant IDs non-null.

### HIGH — File/in-memory datastore is not tenant-isolated or durable
**File:** `backend/src/utils/datastore.ts`

The datastore holds a single shared JSON store and parent matching supports phone/email as identifiers. It is not a safe multi-tenant production persistence layer and can create cross-user/cross-school exposure.

**Required fix:** Use the relational database as the source of truth. If a local/demo datastore remains, disable it in production and make it tenant-scoped with explicit test-only configuration.

## Implementation plan (do not skip migration verification)

1. **Authentication hardening:** fail-closed JWT middleware; remove implicit Principal fallback; remove demo passwords and fake OTP success; secure refresh-token rotation/revocation.
2. **Authorization hardening:** derive actor identity only from verified token claims; remove query-param identity overrides and hard-coded parent maps; check parent-child and teacher-class relationships on every request; remove unsafe first-record fallback.
3. **Tenant model:** add `School`; add `schoolId` to all tenant-owned models; add tenant-scoped indexes/unique constraints and compound foreign-key safeguards.
4. **Database enforcement:** enable PostgreSQL Row-Level Security on every tenant-owned table; use a least-privileged runtime DB role that is not superuser and does not have `BYPASSRLS`; force RLS where applicable. Set tenant context transaction-locally from verified server-side identity, never from an untrusted request header/body.
5. **Negative security tests:** school A cannot read/write school B; parent A cannot read parent B's child by changing URL/query IDs; teacher cannot access unassigned class; missing/expired/forged token is denied; tenant context does not leak across pooled/reused DB connections.
6. **Deployment controls:** review Vercel/backend environment variables and DB role grants; rotate any exposed demo credentials/secrets; do not put service-role or database secrets in frontend variables; deploy only after migration, tests, and backup/restore checks pass.

## Safe rollout notes

- This audit branch intentionally records findings and the required sequence; it does not apply a speculative schema migration or alter production behavior.
- Do not merge a tenant migration until the production database provider, existing schema state, data volume, and backup/restore procedure are verified.
- Do not claim isolation is complete until automated negative-path tests pass against the actual deployed database role and API.

## Acceptance criteria

- No request without a valid authenticated identity reaches protected handlers.
- Parent endpoints ignore caller-supplied phone/email and use only authenticated `userId` relationships.
- No hard-coded demo account or static parent-to-child map is reachable in production.
- Every tenant-owned row has a valid `schoolId`; every read/write is tenant-scoped in API and PostgreSQL RLS.
- Cross-tenant and cross-parent negative tests return no data and cannot mutate foreign records.
