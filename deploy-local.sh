#!/bin/bash
set -e

# ========== 基本信息 ==========
PROJECT_NAME=catams
DOCKER_USER=dockernekopedia
TAG=$(date +%Y%m%d%H%M)   # 自动生成版本号（例如 202510220131）
COMPOSE_FILE=docker-compose.prod.yml

echo "🧱 当前版本号: $TAG"

# ========== 构建后端 ==========
echo "🚀 构建 backend 镜像..."
cd backend
mvn clean package -DskipTests
cd ..
docker build -t $DOCKER_USER/$PROJECT_NAME-backend:$TAG ./backend
docker tag $DOCKER_USER/$PROJECT_NAME-backend:$TAG $DOCKER_USER/$PROJECT_NAME-backend:latest

# ========== 构建前端 ==========
echo "🚀 构建 frontend 镜像..."
docker build -t $DOCKER_USER/$PROJECT_NAME-frontend:$TAG ./frontend
docker tag $DOCKER_USER/$PROJECT_NAME-frontend:$TAG $DOCKER_USER/$PROJECT_NAME-frontend:latest
# ========== 推送到 Docker Hub ==========
echo "📦 推送镜像到 Docker Hub..."
export DOCKER_CONTENT_TRUST=0
docker push $DOCKER_USER/$PROJECT_NAME-backend:$TAG
docker push $DOCKER_USER/$PROJECT_NAME-frontend:$TAG
docker push $DOCKER_USER/$PROJECT_NAME-backend:latest
docker push $DOCKER_USER/$PROJECT_NAME-frontend:latest

# ========== 本地容器更新 ==========
echo "🧹 停止旧容器..."
docker-compose -f $COMPOSE_FILE down

echo "🚀 启动新容器 (version: $TAG)..."
# 可按需选择只启 backend 或全启
docker-compose -f $COMPOSE_FILE up -d --build --force-recreate

# ========== 输出结果 ==========
echo "✅ 部署完成！"
echo "当前镜像版本："
docker images | grep $PROJECT_NAME