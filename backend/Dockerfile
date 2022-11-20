#FROM node:16-bullseye-slim
FROM node:16-alpine3.11

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install

COPY prisma/schema.prisma ./prisma/
RUN npx prisma generate

COPY . .

RUN npm run build
EXPOSE 5000
CMD [ "npm", "run", "start" ]