FROM node:10-stretch AS builder
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
COPY server /app/server
COPY .gitignore \
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

ARG BUILD_ENV=prod
COPY environment.conf.${BUILD_ENV}.json /app/environment.conf.json

# Install NPM dependencies, cleaning cache afterwards:
RUN npm --production=false \
      --unsafe-perm \
      --no-progress \
      ci && \
      npm cache clean --force

COPY src /app/src

ARG GIT_COMMIT
ENV GIT_COMMIT ${GIT_COMMIT}

RUN npm run lint
RUN npm run test
RUN npm run build
