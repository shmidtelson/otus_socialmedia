FROM node:22

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

# Command to start the application in development mode
#CMD [ "yarn", "start:dev" ]
# Command to start the application in production mode
CMD [ "yarn", "start:prod" ]