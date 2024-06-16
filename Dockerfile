FROM node:20-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY . .

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

RUN npm run generate

USER node

EXPOSE 3000

CMD node src/server/server.js