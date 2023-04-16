FROM node:alpine
WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .
RUN npm ci
RUN npm rebuild bcrypt
COPY . .
CMD [ "npm","start" ]
