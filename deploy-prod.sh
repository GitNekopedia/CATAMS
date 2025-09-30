#!/bin/bash
set -e

PROJECT_NAME=catams
DOCKER_USER=dockernekopedia

echo "📥 拉取最新镜像..."
docker pull $DOCKER_USER/$PROJECT_NAME-backend:latest
docker pull $DOCKER_USER/$PROJECT_NAME-frontend:latest

echo "🧹 停止并删除旧容器..."
docker-compose -f docker-compose.prod.yml down

echo "🚀 使用新镜像重启服务..."
docker-compose -f docker-compose.prod.yml up -d

echo "✅ 部署完成，服务已使用最新镜像！"
