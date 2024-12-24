FROM node:20-alpine AS builder

ENV NODE_ENV=build

COPY . .

RUN corepack enable pnpm

WORKDIR /cloud-dev-types
RUN pnpm install --frozen-lockfile
RUN pnpm run build

WORKDIR /cloud-dev-tenant-management-ui
RUN pnpm install --frozen-lockfile
RUN pnpm run build

WORKDIR /cloud-dev-tenant-management
RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:20-alpine

ENV TZ=${TZ:-Europe/Berlin}
ENV NODE_ENV=production

EXPOSE ${PORT:-3000}

# Types are needed for the tenant management service since it imports them through relative paths
COPY --from=builder /cloud-dev-types/ ./cloud-dev-types/
COPY --from=builder /cloud-dev-tenant-management/client ./client
COPY --from=builder /cloud-dev-tenant-management/package.json ./
COPY --from=builder /cloud-dev-tenant-management/node_modules/ ./node_modules/
COPY --from=builder /cloud-dev-tenant-management/dist/ ./dist/
COPY --from=builder /cloud-dev-tenant-management/.env.development ./

USER node
CMD ["node", "dist/main.js"]
