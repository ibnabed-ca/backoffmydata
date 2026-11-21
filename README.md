# Back Off My Data

A feedback prototype for a proposed privacy service. It does not collect payments, create accounts, send deletion requests, or freeze credit. Proposed features and pricing are concepts, not promises of an operating service.

## Run locally

Install Bun, then run `bun install` and `bun run dev`. Build the static frontend with `bun run build`. The GitHub Pages workflow builds with the repository base path; Pages must be configured to deploy using GitHub Actions.

A separate experimental local API can be started with `JWT_SECRET=<at least 32 random characters> bun run server`. It binds to localhost and stores Argon2id password hashes in a local SQLite database. It is intentionally not connected to the public demo. It is not production-ready: it lacks rate limiting, account recovery, email verification, session revocation, and production security review. Never use real user data with it. GitHub Pages hosts static files only and cannot run the Bun API.

Before offering any real service, validate the legal, operational, consent, security, and company-specific request processes and substantiate all marketing claims.
