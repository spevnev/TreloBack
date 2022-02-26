FROM node:17.5-alpine

EXPOSE 3000

RUN mkdir app
WORKDIR app

COPY package.json package.json
RUN npm install

ENV DB_HOST="128.124.121.236"
ENV DB_PORT=5432
ENV DB_USER="root"
ENV DB_PASSWORD="root"

COPY . .

CMD ["node", "app"]