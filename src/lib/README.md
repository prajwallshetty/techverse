# AgriHold AI Architecture

- `auth/`: Auth.js configuration and exported App Router handlers.
- `db/`: MongoDB Atlas client, database access, and collection factories.
- `api/`: shared response helpers for public route handlers.
- `env.ts`: typed environment parsing for startup-safe configuration.

Keep authorization checks close to data access and route handlers. App Router
layouts can be reused during navigation, so protected reads and writes should
verify the session where the data is fetched or mutated.
