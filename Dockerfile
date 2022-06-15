FROM node:14
MAINTAINER seonghyeon.jee@gmail.com

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 9000 9999


CMD ["npm", "run", "start:prod"]
