FROM node:18-alpine AS base

# 依赖安装阶段（全量依赖，用于编译）
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn config set registry 'https://registry.npmmirror.com/' && \
    yarn install --frozen-lockfile

# 构建阶段（tsc 编译）
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN yarn build

# 运行阶段（超小体积！）
FROM base AS runner
WORKDIR /app

# 关键：只拷贝 3 样东西，不重新安装！
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=deps /app/node_modules ./node_modules

# 生产环境变量
ENV NODE_ENV=production
ENV PORT=3001

# 安全用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

CMD ["node", "dist/index.js"]