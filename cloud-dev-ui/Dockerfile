FROM node:20-alpine as builder

ARG VITE_PROPERTY_MANAGEMENT_API_URL=http://localhost:8080

ENV VITE_PROPERTY_MANAGEMENT_API_URL=$VITE_PROPERTY_MANAGEMENT_API_URL
ENV NODE_ENV=build

COPY . .

RUN corepack enable pnpm

WORKDIR /cloud-dev-types
RUN pnpm install --frozen-lockfile
RUN pnpm run build

WORKDIR /cloud-dev-ui
RUN pnpm install --frozen-lockfile
RUN pnpm run build


FROM nginx as production

EXPOSE 80

RUN mkdir /app

COPY --from=builder /cloud-dev-ui/dist/ /app

COPY /cloud-dev-ui/nginx.conf /etc/nginx/nginx.conf
