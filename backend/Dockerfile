FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app

# 只复制依赖清单，利用缓存
COPY package.json yarn.lock ./
# 淘宝镜像 + 严格锁定版本 + 仅安装生产依赖
RUN yarn config set registry 'https://registry.npmmirror.com/' && \
    yarn install --frozen-lockfile --production

FROM base AS builder
WORKDIR /app
# 继承已安装的依赖
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建环境设置为生产，优化产物
ENV NODE_ENV=production
RUN yarn build

FROM base AS runner
WORKDIR /app

# 生产环境标配
ENV NODE_ENV=production
ENV PORT=3001

# 复制构建产物 + 依赖（仅生产依赖）
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=deps /app/node_modules ./node_modules

# 创建非 root 用户，安全规范
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

CMD ["yarn", "start"]