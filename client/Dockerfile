# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
COPY package.json ./ package-lock.json ./
COPY . /app/
RUN npm install --legacy-peer-deps
EXPOSE 3000
CMD [ "npm", "start" ]