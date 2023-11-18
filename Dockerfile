FROM node:latest

WORKDIR /usr/src/app

# install dependencies
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npx pnpm i

# build project
COPY . .
RUN npx pnpm build

# run project
CMD [ "node", "." ]
