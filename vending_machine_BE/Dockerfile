FROM node:22.17.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

USER node

CMD ["node", "dist/main"]