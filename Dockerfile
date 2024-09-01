FROM node:18-alpine

RUN apk add --no-cache curl bash

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN rm -f .env

RUN mv .env.docker .env

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

RUN npm run build

EXPOSE 3000

CMD ["bash", "-c", "/wait-for-it.sh postgres:5432 -- npx typeorm migration:run -d ./dist/data-source.js && npm run start:prod"]
