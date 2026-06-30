#!/bin/bash
set -e

# ========== 基本信息 ==========
PROJECT_NAME=catams
DOCKER_USER=dockernekopedia
TAG=$1   # 从本地脚本传入版本号
COMPOSE_FILE=docker-compose.prod.yml

if [ -z "$TAG" ]; then
  echo "❌ 错误：未传入版本号 TAG"
  echo "用法：bash deploy-remote.sh <TAG>"
  exit 1
fi

echo "🚀 开始部署 CATAMS 版本: $TAG"

# ========== 停止并删除旧容器 ==========
echo "🧹 停止并清理旧容器..."
docker-compose -f $COMPOSE_FILE down --remove-orphans

# ========== 删除旧镜像（防止缓存） ==========
echo "🧼 删除旧镜像..."
docker rmi -f $DOCKER_USER/$PROJECT_NAME-backend:latest || true
docker rmi -f $DOCKER_USER/$PROJECT_NAME-frontend:latest || true
docker rmi -f $DOCKER_USER/$PROJECT_NAME-backend:$TAG || true
docker rmi -f $DOCKER_USER/$PROJECT_NAME-frontend:$TAG || true

# ========== 拉取最新镜像 ==========
echo "📥 拉取新镜像 (version: $TAG)..."
docker pull $DOCKER_USER/$PROJECT_NAME-backend:$TAG
docker pull $DOCKER_USER/$PROJECT_NAME-frontend:$TAG

# docker-compose.prod.yml runs the latest tags; pin latest to the requested version.
docker tag $DOCKER_USER/$PROJECT_NAME-backend:$TAG $DOCKER_USER/$PROJECT_NAME-backend:latest
docker tag $DOCKER_USER/$PROJECT_NAME-frontend:$TAG $DOCKER_USER/$PROJECT_NAME-frontend:latest

# ========== 启动新容器 ==========
echo "🚀 启动新容器..."
docker-compose -f $COMPOSE_FILE up -d --force-recreate

# ========== 校验结果 ==========
echo "🔍 当前运行镜像："
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}" | grep $PROJECT_NAME

echo "✅ 部署完成，CATAMS 版本: $TAG 已生效！"
