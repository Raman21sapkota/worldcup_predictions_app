FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./
COPY prisma/ ./prisma/
RUN npm ci

COPY . .

EXPOSE 4000

CMD ["sh", "-c", "npx prisma db push && node src/server.js"]
