FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

# Command to start the application in development mode
CMD [ "yarn", "start:dev" ]