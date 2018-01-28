FROM node:9-slim

WORKDIR /boring-moving-server

COPY . /boring-moving-server
RUN rm -rf node_modules && npm install && npm run-script build


EXPOSE 3000
CMD [ "npm", "run-script","prod" ]
