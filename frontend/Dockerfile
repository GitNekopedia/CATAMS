# =============================
# 构建阶段：使用 Node 构建前端产物
# =============================
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --registry=https://registry.npmmirror.com

COPY . .
RUN npm run build

# =============================
# 运行阶段：使用 Nginx 托管 dist
# =============================
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# 清空默认页面
RUN rm -rf ./*

# 拷贝构建产物到 nginx 的根目录
COPY --from=build /app/dist ./

# 拷贝自定义配置
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
