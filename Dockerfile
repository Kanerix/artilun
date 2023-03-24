FROM node AS modules
WORKDIR /modules

RUN npm install -g pnpm
COPY ./package.json ./pnpm-lock.json ./
RUN pnpm install --frozen-lockfile


FROM node AS build
WORKDIR /build

COPY --from=modules /modules/node_modules ./node_modules
COPY . .
RUN pnpm run build


FROM node AS runner
WORKDIR /app

COPY --from=build /build/node_modules ./node_modules

CMD ["node", "dist/index.js"]

