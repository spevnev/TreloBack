FROM node:17.5-alpine

ARG PORT=3000
ENV SERVER_PORT=$PORT
EXPOSE $PORT

RUN mkdir app
WORKDIR app

COPY package.json package.json
RUN npm install

ENV DB_HOST="128.124.121.236"
ENV DB_PORT=5432
ENV DB_NAME="trelo"
ENV DB_USER="root"
ENV DB_PASSWORD="root"

COPY . .

CMD ["node", "app"]