FROM node:latest

WORKDIR /usr/src/app

# install dependencies
COPY package.json ./
COPY yarn.lock ./
RUN npx yarn

# build project
COPY . .
RUN npx yarn build

# run project
CMD [ "yarn", "start" ]
