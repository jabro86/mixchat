FROM node:8.11.3
WORKDIR /app
COPY package.json .
COPY src ./src/
COPY nodemon.json .
COPY tsconfig.json .
COPY tslint.json .
RUN yarn install
CMD npm run start