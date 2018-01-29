FROM node:9-slim

WORKDIR /boring-moving-server

COPY . /boring-moving-server
RUN yarn install && yarn run build


EXPOSE 3000
CMD [ "yarn", "run","prod" ]
