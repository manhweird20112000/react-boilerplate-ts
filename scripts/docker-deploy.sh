#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.docker"
COMPOSE_FILE="${ROOT_DIR}/docker-compose.yml"
SERVICE_NAME="web"

usage() {
  cat <<'EOF'
Usage: scripts/docker-deploy.sh [command]

Commands:
  deploy   Build image and start container (default)
  up       Alias for deploy
  down     Stop and remove containers
  restart  Restart containers (rebuild)
  logs     Follow container logs
  status   Show container status and health
  pull     Pull image from registry (set DOCKER_IMAGE)

Examples:
  scripts/docker-deploy.sh
  scripts/docker-deploy.sh deploy
  scripts/docker-deploy.sh logs
  DOCKER_IMAGE=ghcr.io/owner/repo:latest scripts/docker-deploy.sh pull
EOF
}

ensure_env_file() {
  if [[ ! -f "${ENV_FILE}" ]]; then
    cp "${ROOT_DIR}/.env.docker.example" "${ENV_FILE}"
    echo "Created ${ENV_FILE} from .env.docker.example"
    echo "Edit ${ENV_FILE} before production deploy."
  fi
}

compose() {
  docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" "$@"
}

wait_for_healthy() {
  local port
  port="$(grep -E '^APP_PORT=' "${ENV_FILE}" | cut -d= -f2 | tr -d '"' || true)"
  port="${port:-8080}"
  echo "Waiting for app at http://127.0.0.1:${port} ..."
  for _ in $(seq 1 30); do
    if curl -fsS "http://127.0.0.1:${port}/" >/dev/null 2>&1; then
      echo "Deploy OK: http://127.0.0.1:${port}"
      return 0
    fi
    sleep 2
  done
  echo "Container started but health check timed out."
  compose logs --tail=50 "${SERVICE_NAME}"
  return 1
}

cmd_deploy() {
  ensure_env_file
  cd "${ROOT_DIR}"
  compose up -d --build --remove-orphans
  wait_for_healthy
}

cmd_down() {
  ensure_env_file
  cd "${ROOT_DIR}"
  compose down --remove-orphans
  echo "Stopped."
}

cmd_restart() {
  cmd_down
  cmd_deploy
}

cmd_logs() {
  ensure_env_file
  cd "${ROOT_DIR}"
  compose logs -f "${SERVICE_NAME}"
}

cmd_status() {
  ensure_env_file
  cd "${ROOT_DIR}"
  compose ps
  docker inspect --format='{{.State.Health.Status}}' "$(compose ps -q "${SERVICE_NAME}" 2>/dev/null | head -n1)" 2>/dev/null || true
}

cmd_pull() {
  if [[ -z "${DOCKER_IMAGE:-}" ]]; then
    echo "Set DOCKER_IMAGE, e.g. DOCKER_IMAGE=ghcr.io/owner/repo:latest"
    exit 1
  fi
  ensure_env_file
  cd "${ROOT_DIR}"
  docker pull "${DOCKER_IMAGE}"
  compose up -d --no-build
  wait_for_healthy
}

COMMAND="${1:-deploy}"

case "${COMMAND}" in
  deploy | up)
    cmd_deploy
    ;;
  down | stop)
    cmd_down
    ;;
  restart)
    cmd_restart
    ;;
  logs)
    cmd_logs
    ;;
  status)
    cmd_status
    ;;
  pull)
    cmd_pull
    ;;
  -h | --help | help)
    usage
    ;;
  *)
    echo "Unknown command: ${COMMAND}"
    usage
    exit 1
    ;;
esac
