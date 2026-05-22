#!/usr/bin/env bash
exec "$(dirname "$0")/docker-deploy.sh" up "$@"
