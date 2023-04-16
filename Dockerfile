FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json .
RUN npm ci
RUN npm rebuild bcrypt
COPY . .
CMD [ "npm","start" ]
