# Supabase React Auth with Prisma ORM

When cloning this project in container volume (remote), a script located in `.devcontainer/scripts/bootstrap.sh` will bootstrap everything for you; that means, installing `frontend/package.json` & `backend/package.json` dependencies with npm.

When container correctly bootstrapped make sure you have/create in your backend/frontend folderd your own `.env` file because prisma schema requires a `DATABASE_URL` & `npm run db:seed` command as well