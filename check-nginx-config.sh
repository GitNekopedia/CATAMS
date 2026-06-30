#!/bin/bash

echo "🔍 检查前端容器 Nginx 配置..."
echo ""

# 查找前端容器
FRONTEND_CONTAINER=$(docker ps --format "{{.Names}}" | grep frontend | head -1)

if [ -z "$FRONTEND_CONTAINER" ]; then
  echo "❌ 未找到前端容器"
  exit 1
fi

echo "📦 容器名称: $FRONTEND_CONTAINER"
echo ""

# 检查 gzip 配置
echo "1️⃣ 检查 gzip 配置:"
docker exec $FRONTEND_CONTAINER grep -A 5 "gzip on" /etc/nginx/conf.d/default.conf || echo "❌ 未找到 gzip 配置"
echo ""

# 检查缓存配置
echo "2️⃣ 检查缓存配置:"
docker exec $FRONTEND_CONTAINER grep -A 3 "Cache-Control" /etc/nginx/conf.d/default.conf || echo "❌ 未找到缓存配置"
echo ""

# 测试 Nginx 配置语法
echo "3️⃣ 测试 Nginx 配置语法:"
docker exec $FRONTEND_CONTAINER nginx -t
echo ""

# 检查镜像信息
echo "4️⃣ 容器镜像信息:"
docker inspect $FRONTEND_CONTAINER --format='{{.Config.Image}}'
echo ""

echo "✅ 检查完成！"
