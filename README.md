# WV Nursing Licensing Data

Next.js App Router dashboard for the West Virginia RN Board public roster snapshot.

## Local development

Set `DATABASE_URL` to a read-only PostgreSQL connection containing `nursing_licensees`, then run:

```bash
npm install
npm run dev
```

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The application uses server-only parameterized queries, 50-row cursor pagination, a 100-row hard cap, and a lightweight public endpoint rate limit. Never use an owner connection in Vercel.
