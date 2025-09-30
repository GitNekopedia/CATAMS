#!/bin/bash
set -e

# 项目名
PROJECT_NAME=catams
DOCKER_USER=dockernekopedia

# 构建 backend 镜像
echo "🚀 构建 backend 镜像..."
docker build -t $DOCKER_USER/$PROJECT_NAME-backend:latest ./backend

# 构建 frontend 镜像
echo "🚀 构建 frontend 镜像..."
docker build -t $DOCKER_USER/$PROJECT_NAME-frontend:latest ./frontend

# 推送到 Docker Hub
echo "📦 推送镜像到 Docker Hub..."
docker push $DOCKER_USER/$PROJECT_NAME-backend:latest
docker push $DOCKER_USER/$PROJECT_NAME-frontend:latest

# 推送代码到 GitHub（保留源码 & 配置）
echo "📤 推送代码到 GitHub..."
git add .
git commit -m "Update deployment"
git push origin main

echo "✅ 本地构建和推送完成！"
