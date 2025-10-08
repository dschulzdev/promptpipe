Vercel deployment notes

What runs during the Vercel build

- The Vercel `buildCommand` runs `pnpm --filter ./apps/backend run vercel-build`.
- `vercel-build` runs `db:migrate:prod` (which runs `prisma generate` and `prisma migrate deploy`) and then builds the Nest app.

Required environment variables on Vercel

- DATABASE_URL: Postgres connection string (must be accessible from Vercel during build and runtime).
- Any other env vars the app needs at build or runtime (REDIS_URL, API keys, etc.).

Notes and recommendations

- If you don't want migrations to run during build, modify `vercel.json` to remove `buildCommand`.
- Ensure `DATABASE_URL` points to your production database and that running `prisma migrate deploy` during build is acceptable for your workflow.
- For zero-downtime, consider running migrations in a separate CI step or migration job instead of during build.

How to test locally

1. Create a `.env` in `apps/backend` with DATABASE_URL pointing to a dev/test database.
2. Run:

   pnpm --filter ./apps/backend -w run vercel-build

This will generate Prisma client and (if a DB is reachable) deploy migrations and build the project.
