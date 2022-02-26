FROM node:17.5-alpine

ENV DB_HOST="localhost"
ENV DB_PORT=5432
ENV DB_NAME="trelo"
ENV DB_USER="root"
ENV DB_PASSWORD="root"

ARG PORT=3000
ENV PORT=$PORT
EXPOSE $PORT

RUN mkdir app
WORKDIR app

RUN mkdir -p public && \
    mkdir -p public/files && \
    mkdir -p public/icons

COPY package.json package.json
RUN npm install

COPY . .

CMD ["node", "app"]