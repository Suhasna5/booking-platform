# Agent Instructions

Read this entire file before starting any task.

## Self-Correcting Rules Engine

This file contains a growing ruleset that improves over time. **At session start, read the entire "Learned Rules" section before doing anything.**

## How it works

1. When the user corrects you or you make a mistake, **immediately append a new rule** to the "Learned Rules" section at the bottom of this file.
2. Rules are numbered sequentially and written as clear, imperative instructions.
3. Format: `N. [CATEGORY] Never/Always do X — because Y.`
4. Categories: `[STYLE]`, `[CODE]`, `[ARCH]`, `[TOOL]`, `[PROCESS]`, `[DATA]`, `[UX]`, `[OTHER]`
5. Before starting any task, scan all rules below for relevant constraints.
6. If two rules conflict, the higher-numbered (newer) rule wins.
7. Never delete rules. If a rule becomes obsolete, append a new rule that supersedes it.

## When to add a rule

- User explicitly corrects your output ("no, do it this way")
- User rejects a file, approach, or pattern
- You hit a bug caused by a wrong assumption about this codebase
- User states a preference ("always use X", "never do Y")

## Rule format example

```
14. [CODE] Always use `bun` instead of `npm` — user preference, bun is installed globally.
15. [STYLE] Never add emojis to commit messages — project convention.
16. [ARCH] API routes live in `src/server/routes/`, not `src/api/` — existing codebase pattern.
```

## Learned Rules

<!-- New rules are appended below this line. Do not edit above this section. -->
1. [STYLE] Keep comments minimal. Only write one when the *why* is non-obvious. Don't restate what the code does, don't narrate the current change, don't leave `// removed X` breadcrumbs. One short line max — no multi-line comment blocks or paragraph docstrings.
2. [STYLE] Never use em dashes anywhere in code, docs, or responses for this repo, because that is a user preference.
3. [ARCH] Always use noun-based, plural, consistent REST resource names such as `/services` and `/bookings/{id}/cancel`, because the assessment requires clean resource naming.
4. [CODE] Always expose explicit request and response DTOs from API endpoints and never return TypeORM entities directly, because API contracts must stay clear and decoupled from persistence models.
5. [CODE] Always use `201 Created` for creates, `200 OK` for successful reads, `200 OK` or `204 No Content` for updates, `204 No Content` for deletes, `400 Bad Request` for validation failures, `404 Not Found` for missing resources, and `409 Conflict` for duplicate or conflicting business states where appropriate, because status codes are part of the assessment criteria.
6. [CODE] Always return a consistent error payload with `statusCode`, `message`, and `traceId`, and include validation `errors` when applicable, because failure responses should be predictable.
7. [ARCH] Always keep controllers thin and route business logic through NestJS services and TypeORM repositories, because the expected flow is Controller -> Service -> Repository -> Database.
8. [ARCH] Always inject TypeORM repositories through NestJS services and never access the database directly from controllers, because the repository pattern keeps persistence concerns isolated.
9. [ARCH] Always model domain behavior explicitly for actions such as booking status changes and cancellation, because business rules should live in the application layer instead of being scattered across controllers.
10. [CODE] Always validate every request DTO for required fields, formats, future dates, valid booking status transitions, existing services, and duplicate bookings before mutating state, because validation coverage is a core assessment requirement.
11. [PROCESS] Always keep the solution aligned with the required stack and deliverables: NestJS, TypeScript, TypeORM, PostgreSQL via Docker, migrations, JWT authentication, Swagger, `.env.example`, and README setup guidance, because completeness is part of the assessment.
12. [PROCESS] Always add or update tests for important authentication, booking, and booking-status business rules when behavior changes, because those rules are explicitly called out in the assessment.
13. [UX] Always enable Swagger/OpenAPI and document endpoints, request models, response models, status codes where possible, and clear endpoint tags or names, because the API must be easy to inspect and test.
14. [PROCESS] Always follow the branch flow `main` -> `dev` -> `feature/*`, because changes should be developed on feature branches, reviewed by pull request, merged into `dev`, and promoted to `main` only when ready for release.
15. [PROCESS] Always create new work from `dev` and target pull requests back into `dev`, because the expected workflow is feature branch -> pull request -> `dev`.
16. [PROCESS] Never branch directly from `main` for normal feature work, and never open normal feature pull requests directly into `main`, because `main` should stay stable and release-ready.
17. [PROCESS] Always use descriptive branch names such as `feature/booking-management`, `fix/booking-date-validation`, `chore/update-swagger-docs`, or `docs/readme-setup`, because branch purpose should be obvious at a glance.
18. [PROCESS] Always keep branch prefixes consistent by using `feature/`, `fix/`, `chore/`, `docs/`, `refactor/`, or `test/` as appropriate, because predictable naming improves team collaboration.
19. [STYLE] Always write commit messages in Conventional Commit style such as `feat: add booking cancellation endpoint` or `fix: prevent duplicate booking slots`, because commit history should stay searchable and consistent.
20. [STYLE] Always keep the commit subject concise, imperative, and lowercase, and never end it with a period, because clean commit subjects are easier to scan.
21. [PROCESS] Never mix unrelated changes in one commit, because each commit should represent one clear piece of work that can be reviewed and reverted safely.
22. [PROCESS] Always open a pull request for feature branches before merging into `dev`, because review is a required part of the workflow.
23. [PROCESS] Always load and follow the repository pull request template when one exists, because pull requests should capture the standard context, testing notes, and review checklist.
24. [PROCESS] Always include in every pull request a clear summary, linked task or requirement when available, testing notes, and screenshots or API examples when relevant, because reviewers need enough context to validate the change quickly.
25. [PROCESS] Always keep pull requests focused and reasonably small, because smaller reviews are faster, safer, and easier to reason about.
26. [PROCESS] Always read and follow `AGENTS.md` before each task, because the user requires it as the source of project-specific working rules.
27. [TOOL] Always make formatting commands tolerate empty source globs, because the scaffold may not yet contain files in every configured directory.
28. [PROCESS] Always confirm whether a scaffold path already contains an implementation file before choosing an update instead of an add operation, because placeholder directories may be intentionally empty.
29. [TOOL] Always expose a package script before invoking a named migration command, because verification commands must be reproducible for every developer.
30. [PROCESS] Always wait for PostgreSQL readiness before generating or running migrations, because a started container may not yet accept database connections.
31. [TOOL] Never assign to `status` in zsh scripts, because zsh reserves that variable as read-only.
32. [DATA] Always mount the current `postgres` image volume at `/var/lib/postgresql`, because PostgreSQL 18 and later manage version-specific data directories below that path.
33. [TOOL] Always make optional file searches non-blocking, because no matching project template is a valid result.
34. [CODE] Always narrow framework exception payloads before accessing fields, because NestJS exposes non-string exception responses as generic objects.
35. [PROCESS] Always supply documented environment variables explicitly for local runtime checks, because `.env` is intentionally ignored and may be absent.
36. [STYLE] Always add a single short comment when the purpose of a new file, type, or non-obvious block would be unclear to a learner, because maintainability here requires brief why-oriented guidance without long AI-style comment walls.
37. [STYLE] Always add one short purpose comment above each CRUD endpoint mapping, because endpoint blocks should be easy to scan for learners without adding noisy comment walls.
38. [PROCESS] Always keep commits small enough for fast review: under 100 LOC is excellent, 100 to 300 LOC is ideal for most feature or fix commits, 300 to 500 LOC is acceptable for one logical change, and 500 to 1000 LOC is large and should be split if possible, because review quality drops as commit size grows.
39. [TOOL] Always keep the migration-generation script path-agnostic, because every schema change needs its own descriptive migration name.
40. [TEST] Always run the full lint command after adding tests, because Jest mocks must satisfy the project's strict TypeScript safety rules.
