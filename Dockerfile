FROM node:20-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

RUN npx prisma generate --schema prisma/schema-postgres.prisma

USER node

COPY . .

EXPOSE 3000

CMD node src/server/server.js