# Supabase React Auth with Prisma ORM

When cloning this project in container volume (remote), a script located in `.devcontainer/scripts/bootstrap.sh` will bootstrap everything for you; that means, installing `frontend/package.json` & `backend/package.json` dependencies with npm.

When container correctly bootstrapped make sure you have/create in your backend/frontend folders your own `.env` file because prisma schema and postgres local database requires a `DATABASE_URL`