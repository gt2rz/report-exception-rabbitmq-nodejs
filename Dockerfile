ARG PORT=3000
ARG NODE_VERSION=20.9.0-alpine3.18

FROM node:${NODE_VERSION} as build
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app
RUN npm run build

FROM node:${NODE_VERSION} as cache
WORKDIR /app
COPY package*.json /app/
RUN npm install --only=production

FROM node:${NODE_VERSION} as production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/package*.json /app/
COPY --from=build /app/dist /app/dist
COPY --from=cache /app/node_modules /app/node_modules
EXPOSE ${PORT}
CMD ["npm", "start"]

FROM build as development
ENV NODE_ENV=development
WORKDIR /app
RUN npm install --only=development
EXPOSE ${PORT}
CMD ["npm", "run", "dev"]