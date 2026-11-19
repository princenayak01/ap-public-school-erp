# Render PostgreSQL Multi-Tenant Rollout

Status: implementation branch only. This document is a rollout contract; it does not run SQL or change the Render database.

## Production target

- Provider: Render Managed PostgreSQL.
- Existing tenant: A. P. Public School (Jhansi).
- Application ORM: Prisma 5.x.
- API: Express / TypeScript.
- Current production safety concern: the current Prisma schema has no tenant ownership key. Adding a tenant claim to JWTs alone would not isolate any records.

## Changes already staged on this branch

- Fail-closed JWT authentication; database-backed login/refresh only; no demo fallback identity.
- Parent portal access is resolved from the verified JWT subject and database parent-child relationship.
- Frontend login fallback tokens and the hard-coded parent-to-child directory have been removed; dashboard sessions are checked against the backend.
- Protected API routes require a valid token and PostgreSQL availability. Unscoped teacher access has been removed from student, attendance, and exam routes.
- JSON datastore fallbacks and fabricated success responses have been removed or disabled for student, fee, attendance, exam, timetable, and dashboard operations.
- Production configuration requires strong distinct JWT secrets and an explicit frontend origin; demo seeding requires explicit opt-in.
- Fee payment requests are validated and concurrent balance updates are guarded against stale writes.
- The committed runtime JSON data file was removed from this branch and added to `.gitignore`.

These are source changes only. One CI build passed at an earlier commit; the latest branch commit still needs its own CI result. No Render database backup, restore rehearsal, SQL migration, data backfill, merge, or production deployment has been performed. The Prisma schema still has no tenant ownership model, and this branch is not production-ready.

## Required tenant data model

Create a `School` tenant record and add a non-null `schoolId` ownership key to every tenant-owned table, including:

- users, teachers, parents
- academic years, classes, sections, subjects, students
- attendance, teacher attendance
- fee structures, invoices, payments, concessions
- examinations, exam subjects, marks, report cards
- notifications, school settings, documents, audit logs

Use tenant-scoped unique constraints for values that are only unique inside a school (for example user email/phone, admission number, employee ID, class code, invoice number, receipt number, academic-year name). Keep globally unique IDs as primary keys.

Relations must not permit cross-school references. Add composite unique keys such as `(id, schoolId)` on parent tables and composite foreign keys such as `(parentId, schoolId)` from children. This is especially important for student-to-parent, student-to-class/section, invoice-to-student, payment-to-invoice/student, marks-to-student/exam, and notification-to-user links.

## Migration phases (do not skip)

### Phase 0 — backup and inventory

1. In Render Dashboard → PostgreSQL service → Recovery, create a logical export and download it to secure storage.
2. Confirm whether the database plan supports point-in-time recovery. Render documents PITR for paid instances; Free instances do not have recovery.
3. Record current database size, table row counts, current Prisma migration state, and the exact deployed backend commit.
4. Restore the export to a separate temporary database and verify that it can be read. Never use a `--clean` restore against the live database.
5. Create a staging Render PostgreSQL database from a sanitized copy. Never use real student personal data in an unprotected preview environment.

### Phase 1 — additive schema expansion

1. Create the School table and insert one tenant for A. P. Public School.
2. Add nullable `schoolId` columns and supporting indexes to tenant-owned tables.
3. Backfill all existing rows to the A. P. Public School tenant using verified relationships.
4. Run checks for null tenant IDs, orphan references, duplicate tenant-scoped keys, and cross-school relations.
5. Add composite foreign keys and tenant-scoped unique constraints.
6. Only after all checks pass, make tenant columns NOT NULL.
7. Update Prisma schema and generate a reviewed SQL migration. Use `prisma migrate deploy` in production, never `prisma db push` for this migration.

### Phase 2 — server-side tenant identity

- Resolve `schoolId` from a verified user record in PostgreSQL; never trust a request header, query parameter, body field, or client-provided JWT claim as the authority.
- Include the verified tenant ID in newly issued access and refresh tokens only after checking the user is active and belongs to that tenant.
- Require tenant context on every authenticated route.
- Apply tenant filters to every Prisma query and write, including nested writes and aggregate/report queries.
- Parent authorization must additionally prove the parent-child relation in the same tenant.
- Teacher access must be limited to assigned classes/sections and tenant.
- Principal/admin access is still limited to their own tenant.

### Phase 3 — PostgreSQL Row-Level Security

Enable RLS on every tenant-owned table. Policies must use a transaction-local tenant setting and default-deny when it is absent. Set tenant context and perform the protected Prisma work inside the same database transaction. Do not use session-persistent `SET` state.

The Render application connection must use a dedicated least-privilege database role that does not own the protected tables and does not have `BYPASSRLS` or superuser privileges. Keep a separate migration/admin role for schema changes. Verify RLS under the actual runtime role; testing as the table owner is insufficient.

If Render PgBouncer transaction pooling is enabled, use transaction-local settings only and keep all tenant-scoped work in one transaction. Render documents transaction pooling and warns that session-level state is not compatible with pooled connections.

### Phase 4 — required negative tests

- School A token cannot read, update, delete, count, export, or infer School B data.
- A forged `schoolId` in body/query/header cannot switch tenant.
- Parent A cannot access a student belonging to Parent B, even if the student ID is known.
- Teacher cannot read students outside assigned classes/sections.
- Missing/invalid/expired token receives 401.
- Missing tenant context is denied by both application layer and RLS.
- A pooled connection reused after a transaction cannot retain the previous tenant context.
- Nested creates/updates cannot connect records across tenants.
- All tests run against PostgreSQL using the same restricted role configured in Render, not a superuser.

## Render-specific operational notes

- Internal Render services should use the internal database connection URL where supported; local development uses the external URL.
- Keep credentials only in Render environment variables. Never commit `DATABASE_URL`, external database URLs, or backups to Git.
- If PgBouncer is enabled, use its pool URL only after checking Prisma compatibility and transaction boundaries. Render's pool uses transaction mode; direct URLs remain appropriate for session-state-dependent operations.
- Schedule a maintenance window for the final constraint/RLS cutover. Have a tested rollback/restore path before changing the live service.

## Current release gate

Do not merge/deploy this branch as a completed multi-tenant release until:
- auth-service demo/fallback login is removed,
- all sensitive API routes are authenticated and authorized,
- schema + migration + data backfill are implemented,
- every query/write is tenant-scoped,
- RLS is active and verified under the production application role,
- automated cross-tenant negative tests pass,
- staging restore and migration rehearsal succeed.
