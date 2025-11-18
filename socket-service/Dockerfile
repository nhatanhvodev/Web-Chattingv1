FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY socket-server.js ./

ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "socket-server.js"]

