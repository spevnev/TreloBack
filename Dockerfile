FROM node:17-alpine

RUN mkdir app
WORKDIR app

ENV DATABASE_URL="postgresql://root:root@host.docker.internal/trelo"
ENV NODE_ENV="production"
ENV PORT=3000
EXPOSE 3000

COPY package.json package.json
RUN npm install --only=prod

COPY . .

CMD ["node", "app"]