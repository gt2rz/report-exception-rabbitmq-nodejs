ARG PORT=3000
ARG NODE_VERSION=20.9.0-alpine3.18

FROM node:${NODE_VERSION} as production
ENV NODE_ENV=production
LABEL maintainer="Miguel Gutierrez <gt2rz.dev@gmail.com>"
WORKDIR /app
COPY package*.json /app
RUN npm install --only=production
COPY . /app
RUN chown -R node:node /app
USER node
EXPOSE ${PORT}
CMD ["npm", "start"]

FROM production as development
ENV NODE_ENV=development
RUN npm install --only=development
CMD ["npm", "run", "dev"]