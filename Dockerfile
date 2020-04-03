################################
# Base
################################
FROM node:8.15-stretch AS base
LABEL maintainer="datapunt@amsterdam.nl"

WORKDIR /app

# Run updates and cleanup
RUN apt-get update && apt-get install -y \
      netcat \
      git && \
      rm -rf /var/lib/apt/lists/*

#  Changing git URL because network is blocking git protocol...
RUN git config --global url."https://".insteadOf git://
RUN git config --global url."https://github.com/".insteadOf git@github.com:

COPY internals /app/internals
COPY .gitignore \
      .npmrc \
      .gitattributes \
      .eslintrc.js \
      .prettierrc \
      jest.config.js \
      babel.config.js \
      /app/

# Install language packs
RUN npm install --unsafe-perm -g full-icu
ENV NODE_ICU_DATA="/usr/local/lib/node_modules/full-icu"

COPY package.json \
      package-lock.json \
      /app/

# Install NPM dependencies, cleaning cache afterwards:
RUN npm --production=false \
      --unsafe-perm \
      --no-progress \
      ci && \
      npm cache clean --force

RUN echo {} > /app/environment.conf.json
COPY src /app/src


################################
# Build
################################
FROM node:8.15-stretch AS builder
COPY --from=base /app /app
WORKDIR /app

ARG GIT_COMMIT
ENV GIT_COMMIT ${GIT_COMMIT}

ARG BUILD_ENV=prod
COPY environment.conf.${BUILD_ENV}.json /app/environment.conf.json

ENV NODE_ENV=production
RUN echo "run build"
RUN npm run build

# Write the build number
ARG BUILD_NUMBER=0
RUN echo "build ${BUILD_NUMBER} - `date`" > /app/build/version.txt


################################
# Deploy
################################
FROM nginx:stable-alpine

COPY --from=builder /app/build/. /usr/share/nginx/html/

COPY default.conf /etc/nginx/conf.d/

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
      && ln -sf /dev/stderr /var/log/nginx/error.log
