#!/bin/bash
set -e

PROJECT_NAME=catams
DOCKER_USER=dockernekopedia
TAG=$(date +%Y%m%d%H%M)
COMPOSE_FILE=docker-compose.prod.yml

# Optional proxy. Examples:
#   DEPLOY_PROXY=http://127.0.0.1:7890 bash deploy-local.sh
#   DEPLOY_PROXY=http://127.0.0.1:7890 DEPLOY_BUILD_PROXY=http://host.docker.internal:7890 bash deploy-local.sh
if [ -n "${DEPLOY_PROXY:-}" ]; then
  export HTTP_PROXY="$DEPLOY_PROXY"
  export HTTPS_PROXY="$DEPLOY_PROXY"
  export http_proxy="$DEPLOY_PROXY"
  export https_proxy="$DEPLOY_PROXY"
fi

BUILD_PROXY="${DEPLOY_BUILD_PROXY:-${DEPLOY_PROXY:-}}"
BUILD_ARGS=()
if [ -n "$BUILD_PROXY" ]; then
  BUILD_ARGS+=(--build-arg HTTP_PROXY="$BUILD_PROXY")
  BUILD_ARGS+=(--build-arg HTTPS_PROXY="$BUILD_PROXY")
  BUILD_ARGS+=(--build-arg http_proxy="$BUILD_PROXY")
  BUILD_ARGS+=(--build-arg https_proxy="$BUILD_PROXY")
fi

printf 'Current image version: %s\n' "$TAG"

printf 'Building backend package...\n'
cd backend
mvn clean package -DskipTests
cd ..

printf 'Building backend image...\n'
docker build "${BUILD_ARGS[@]}" -t "$DOCKER_USER/$PROJECT_NAME-backend:$TAG" ./backend
docker tag "$DOCKER_USER/$PROJECT_NAME-backend:$TAG" "$DOCKER_USER/$PROJECT_NAME-backend:latest"

printf 'Building frontend image...\n'
docker build "${BUILD_ARGS[@]}" -t "$DOCKER_USER/$PROJECT_NAME-frontend:$TAG" ./frontend
docker tag "$DOCKER_USER/$PROJECT_NAME-frontend:$TAG" "$DOCKER_USER/$PROJECT_NAME-frontend:latest"

printf 'Pushing images to Docker Hub...\n'
export DOCKER_CONTENT_TRUST=0
docker push "$DOCKER_USER/$PROJECT_NAME-backend:$TAG"
docker push "$DOCKER_USER/$PROJECT_NAME-frontend:$TAG"
docker push "$DOCKER_USER/$PROJECT_NAME-backend:latest"
docker push "$DOCKER_USER/$PROJECT_NAME-frontend:latest"

printf 'Updating local containers...\n'
docker-compose -f "$COMPOSE_FILE" down
docker-compose -f "$COMPOSE_FILE" up -d --build --force-recreate

printf 'Done. Version: %s\n' "$TAG"
docker images | grep "$PROJECT_NAME"