FROM node:20-alpine AS builder

ENV NODE_ENV=build

COPY . .

RUN corepack enable pnpm

WORKDIR /cloud-dev-types
RUN pnpm install --frozen-lockfile
RUN pnpm run build

WORKDIR /cloud-dev-property-management
RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:20-alpine

ENV NODE_ENV=production

EXPOSE ${PORT:-3000}

# Types are needed for the property management service since it imports them through relative paths
COPY --from=builder /cloud-dev-types/ ./cloud-dev-types/
COPY --from=builder /cloud-dev-property-management/package.json ./
COPY --from=builder /cloud-dev-property-management/node_modules/ ./node_modules/
COPY --from=builder /cloud-dev-property-management/dist/ ./dist/

# Create a directory for the SQLite database
RUN mkdir -p /db
RUN chown node: db \
    && chmod u+w db

USER node
CMD ["node", "dist/main.js"]
