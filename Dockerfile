FROM node:18

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm ci

COPY . .

EXPOSE $PORT

CMD ["npm", "run", "start:dev"]
