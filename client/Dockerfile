FROM node:24-bullseye-slim

WORKDIR /app

COPY package*.json ./


RUN npm install

COPY . .
EXPOSE 3000
CMD ["npm", "start"]