FROM node:17-alpine

RUN mkdir app
WORKDIR app

ENV FRONTEND_URL="https://trelo-front.herokuapp.com"
ENV DATABASE_URL="postgresql://root:root@host.docker.internal/trelo"
ENV REDISTOGO_URL="redis://:password@192.168.65.2:6379"
ENV NODE_ENV="production"

ENV PORT=3000
EXPOSE 3000

COPY package.json package.json
RUN npm install --only=prod --no-audit

COPY src .

CMD ["node", "."]