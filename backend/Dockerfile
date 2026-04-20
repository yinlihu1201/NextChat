FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app

COPY package.json yarn.lock ./
# 安装全部依赖（包含开发依赖，用于编译）
RUN yarn config set registry 'https://registry.npmmirror.com/' && \
    yarn install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
# 编译 TypeScript 代码
RUN yarn build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# 只复制生产依赖
COPY package.json yarn.lock ./
RUN yarn config set registry 'https://registry.npmmirror.com/' && \
    yarn install --frozen-lockfile --production

# 复制编译后的代码
COPY --from=builder /app/dist ./dist

# 安全用户配置
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

CMD ["yarn", "start"]