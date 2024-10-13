FROM node:20-alpine as builder

ENV NODE_ENV build

WORKDIR /cloud-dev-property-managment

RUN corepack enable pnpm

COPY . .
RUN pnpm install --frozen-lockfile

RUN pnpm run build

FROM node:20-alpine

ENV NODE_ENV production

EXPOSE ${PORT:-3000}

COPY --from=builder /cloud-dev-property-managment/package.json ./
COPY --from=builder /cloud-dev-property-managment/node_modules/ ./node_modules/
COPY --from=builder /cloud-dev-property-managment/dist/ ./dist/

CMD ["node", "dist/main.js"]
