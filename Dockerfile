FROM node:17-alpine

RUN mkdir app
WORKDIR app

RUN mkdir -p public/files && \
    mkdir -p public/icons

ENV DATABASE_URL="postgresql://root:root@host.docker.internal/trelo"
ENV PRODUCTION=false
ENV PORT=3000
EXPOSE 3000

COPY package.json package.json
RUN npm install --only=prod

ENV IMG_NAME="trelo"
ENV IMG_KEY="542497378556888"
ENV IMG_SECRET="wyP8YLvIesBvWi3IOW2pGbR9q_o"

COPY . .

CMD ["node", "app"]