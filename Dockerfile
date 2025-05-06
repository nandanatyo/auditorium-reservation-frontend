FROM node:23-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

RUN npx vite build

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]
