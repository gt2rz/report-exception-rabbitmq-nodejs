ARG PORT=3000
ARG NODE_VERSION=20.9.0-alpine3.18

FROM node:${NODE_VERSION} as build
ENV NODE_ENV=production
LABEL maintainer="Miguel Gutierrez <gt2rz.dev@gmail.com>"
WORKDIR /app
COPY package*.json /app
COPY . /app

FROM build as production
ENV NODE_ENV=production
RUN npm install --only=production
EXPOSE ${PORT}
CMD ["npm", "start"]

FROM build as development
ENV NODE_ENV=development
RUN npm install --only=development
EXPOSE ${PORT}
CMD ["npm", "run", "dev"]