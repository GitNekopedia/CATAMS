#!/bin/bash
set -e

PROJECT_NAME=catams
DOCKER_USER=dockernekopedia

echo "📥 拉取最新镜像..."
docker pull $DOCKER_USER/$PROJECT_NAME-backend:latest
docker pull $DOCKER_USER/$PROJECT_NAME-frontend:latest

echo "🚀 使用 docker-compose 重启服务..."
docker-compose -f docker-compose.prod.yml up -d

echo "✅ 服务器部署完成！"
