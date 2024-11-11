FROM node:20-alpine AS builder

ARG VITE_FIREBASE_API_KEY

ARG VITE_FIREBASE_AUTH_DOMAIN=https://cloud-porsche.firebaseapp.com

ARG VITE_PROPERTY_MANAGEMENT_API_URL=http://localhost:8080
ARG VITE_PROPERTY_MANAGEMENT_API_OPTIONS

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY

ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN

ENV VITE_PROPERTY_MANAGEMENT_API_URL=$VITE_PROPERTY_MANAGEMENT_API_URL
ENV VITE_PROPERTY_MANAGEMENT_API_OPTIONS=$VITE_PROPERTY_MANAGEMENT_API_OPTIONS
ENV NODE_ENV=build

COPY . .

RUN corepack enable pnpm

WORKDIR /cloud-dev-types
RUN pnpm install --frozen-lockfile
RUN pnpm run build

WORKDIR /cloud-dev-ui
RUN pnpm install --frozen-lockfile
RUN pnpm run build


FROM nginx AS production

EXPOSE 80

RUN mkdir /app

COPY --from=builder /cloud-dev-ui/dist/ /app

COPY /cloud-dev-ui/nginx.conf /etc/nginx/nginx.conf
