# Setup

## Prerequisites

- Node.js (LTS recommended)
- pnpm (see `package.json` → `packageManager`)

## Install dependencies

```bash
pnpm install
```

## Environment

- If the project requires environment variables, create a local file (commonly `.env.local`) based on the project convention.

## Run locally

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Preview production build

```bash
pnpm preview
```

## Lint & format

```bash
pnpm lint
```

Check only (CI / local):

```bash
pnpm lint:ci
pnpm lint:check
```

## Tests

```bash
pnpm test:unit
pnpm test:e2e
```

## Docker

Build and run production image locally:

```bash
cp .env.docker.example .env.docker
docker compose --env-file .env.docker up -d --build
```

Or use deploy scripts (creates `.env.docker` automatically):

```bash
# macOS / Linux
./scripts/docker-deploy.sh deploy

# Windows
scripts\docker-deploy.bat deploy
```

pnpm shortcuts:

```bash
pnpm docker:up        # deploy (build + start)
pnpm docker:down      # stop
pnpm docker:restart   # restart
pnpm docker:logs      # follow logs
pnpm docker:status    # container status
```

Deploy commands:

| Command | Description |
| ------- | ----------- |
| `deploy` / `up` | Build image and start container |
| `down` / `stop` | Stop and remove containers |
| `restart` | Rebuild and restart |
| `logs` | Follow logs |
| `status` | Show running containers |
| `pull` | Pull from registry (`DOCKER_IMAGE=ghcr.io/owner/repo:latest`) |

App is served at `http://localhost:8080` (override with `APP_PORT` in `.env.docker`).

### Docker build fails with `input/output error`

This comes from **corrupted Docker Desktop / BuildKit storage**, not from this repo's Dockerfile.

1. **Quit Docker Desktop** completely (menu bar → Docker → Quit).
2. Reopen Docker Desktop and wait until it is fully running.
3. Clear build cache:

```bash
docker builder prune -af
docker buildx prune -af
```

4. Retry:

```bash
pnpm docker:up
```

If it still fails, reset Docker data:

- Docker Desktop → **Troubleshoot** (bug icon) → **Clean / Purge data** → choose **Clean build cache** (or full reset if needed).
- Restart Docker Desktop, then run `pnpm docker:up` again.

Also check macOS has free disk space (Docker needs several GB for images and cache).

Useful commands:

```bash
pnpm docker:build
pnpm docker:up
pnpm docker:down
```

## CI/CD

GitHub Actions workflows:

| Workflow | Trigger | Purpose |
| -------- | ------- | ------- |
| `ci.yml` | push/PR to `main`/`master` | ESLint (`src`), unit tests, Vite build, Docker build smoke test |
| `docker-deploy.yml` | push to `main`/`master`, tags `v*` | Build and push image to GitHub Container Registry |
| `playwright.yml` | push/PR to `main`/`master` | E2E tests |

### Deploy image from GHCR

After a successful run on the default branch, pull and run:

```bash
docker pull ghcr.io/<owner>/<repo>:latest
docker run -d -p 8080:80 ghcr.io/<owner>/<repo>:latest
```

Optional repository variables for production build (`Settings` → `Secrets and variables` → `Actions` → `Variables`):

- `VITE_API_URL`
- `VITE_APP_NAME`
- `VITE_USE_MOCK`
- `VITE_USE_MSW`
