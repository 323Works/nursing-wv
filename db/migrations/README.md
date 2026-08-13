# Database migrations

Apply these files in numeric order to the `nursing_wv` database.

- `001_source_baseline.sql` is the portable schema-only snapshot from the immutable source database.
- `002_query_indexes.sql` adds the search and cursor-order indexes used by the dashboard.
- `003_runtime_readonly.sql` applies grants after the Neon roles `nursing_runtime` (NOLOGIN) and `nursing_app` exist.

Production data is restored from the separately retained custom-format dump with
`pg_restore --no-owner --no-acl`. Database URLs, passwords, and data dumps must
not be committed to this directory.
