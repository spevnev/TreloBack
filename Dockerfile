FROM node:17-alpine

RUN mkdir app
WORKDIR app

ENV FRONTEND_URL="react-service"
ENV DATABASE_URL="postgresql://SomeUser:SomePassword@postgres-service/trelo"
ENV REDIS_URL="redis://:SomePassword@redis-service:6379"

ENV NODE_ENV="production"

ENV PORT=3000
EXPOSE 3000

COPY package.json package.json
RUN npm install --only=prod --no-audit

COPY src .

CMD ["node", "."]