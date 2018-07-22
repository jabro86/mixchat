FROM node:8.11.3
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
ENV NODE_ENV production
COPY lib .
COPY wait-for-it.sh .
CMD node index.js
USER node