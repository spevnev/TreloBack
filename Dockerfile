FROM node:17.5-alpine

EXPOSE 3000

ENV DB_PORT=5432
ENV DB_USER="root"

RUN mkdir app
WORKDIR app

COPY package.json package.json
RUN npm install

COPY . .

CMD ["node", "app"]