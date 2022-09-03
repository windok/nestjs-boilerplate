# ------ PRODUCTION BUILD IMAGE ---------
FROM node:16.17-alpine as build-stage

# Set up app directory
ARG WORK_DIR=/usr/src/app
ARG PORT=3000

WORKDIR $WORK_DIR

# copy package files
COPY package*.json ./

RUN npm ci

COPY . ./

# lint and test before build
RUN npm run lint && npm run test

RUN npm run build

# ------ PRODUCTION IMAGE ---------
FROM node:16.17 as production

ARG NODE_ENV=production
ARG WORK_DIR=/usr/src/app
ARG PORT=3000
ARG APP_VERSION
ENV APP_VERSION=${APP_VERSION}

WORKDIR $WORK_DIR

COPY package*.json ./

RUN npm ci --production

COPY --from=build-stage $WORK_DIR/dist ./dist

EXPOSE $PORT

ENTRYPOINT ["npm"]

CMD ["run", "start"]
