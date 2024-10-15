FROM node:20-alpine as builder

ENV NODE_ENV build

COPY . .
WORKDIR /cloud-dev-ui

RUN corepack enable pnpm

RUN pnpm install --frozen-lockfile

RUN pnpm run build

FROM node:20-alpine

ENV NODE_ENV production

# 8080 = http-server default port
EXPOSE 8080

COPY --from=builder /cloud-dev-ui/dist/ ./dist/

RUN npm install -g http-server
CMD ["http-server", "dist"]
