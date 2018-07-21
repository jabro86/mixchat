FROM node:8.11.3
WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY src ./src/
COPY nodemon.json .
COPY tsconfig.json .
COPY tslint.json .
COPY wait-for-it.sh .
RUN yarn install
CMD npm run start