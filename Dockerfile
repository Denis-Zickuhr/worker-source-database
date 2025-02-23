FROM node:23-alpine as base
LABEL app-name="worker-source-database"
WORKDIR /app

FROM base as prod
COPY package.json ./
COPY config/config.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build

FROM base as dev
COPY config/config-dev.json ./
COPY package.json ./
COPY package-lock.json ./
RUN npm install

