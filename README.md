## This projet has a major upgrade and will be soon archived.

## The new DevConnector has been moved here: https://github.com/daniellaera/admin-dashboard

# Supabase React Auth with Prisma ORM

When cloning this project in container volume (remote), a script located in `.devcontainer/scripts/bootstrap.sh` will bootstrap everything for you; that means, installing `frontend/package.json` & `backend/package.json` dependencies with npm.

When container correctly bootstrapped make sure you have/create in your backend/frontend folders your own `.env` file because prisma schema and postgres local database requires a `DATABASE_URL`.

You'll notice that in the `.devcontainer/devcontainer.json` line 22 the `"dotfiles.repository": "git@github.com:daniellaera/dotfiles.git"`, I clone the repository dotfiles via SSH.

For doing this, you'll need to have a valid ssh key on your machine, ex: `ssh-keygen -t ed25519 -C "your_email@....com"` and add it to your own GitHub SSH settings, otherwise the remote repository won't be accessible and so the script `install.sh` won't be executed.

### Enjoy {^_^}

![Alt text](/thumbnail.png?raw=true "Optional Title")
