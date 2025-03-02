FROM node:23-alpine as base
LABEL app-name="worker-source-database"
WORKDIR /app

FROM base as prod
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build

FROM base as dev
COPY package.json ./
COPY package-lock.json ./
RUN npm install