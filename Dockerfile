# Install dependencies when needed
FROM node:16-alpine AS modules
RUN apk add --no-cache libc6-compat
WORKDIR /modules

COPY ./package.json ./pnpm-lock.yaml ./prisma ./

RUN npx pnpm install --frozen-lockfile
RUN npx pnpm prisma generate

# Rebuild source code when needed
FROM node:16-alpine AS builder
WORKDIR /build

COPY . .
COPY --from=modules /modules/node_modules ./node_modules

RUN npx pnpm install 


# Create production image
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN adduser -s /bin/nologin -D -S www

COPY --from=builder /build/package.json ./package.json
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/build ./build

USER www

EXPOSE 3000

CMD ["node", "build"]
