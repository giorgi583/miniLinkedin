FROM node:lts

WORKDIR /usr/src/app

COPY package*.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 4700

USER node

CMD [ "npm", "run", "dev" ]