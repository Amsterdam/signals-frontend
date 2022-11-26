################################
# Base
################################
FROM node:14-stretch AS base
LABEL maintainer="datapunt@amsterdam.nl"

WORKDIR /app

# Install dependencies and remove apt cache
RUN apt-get update && apt-get install -y \
  git \
  netcat \
  && rm -rf /var/lib/apt/lists/*

# Change git URL because network is blocking git protocol...
RUN git config --global url."https://".insteadOf git://
RUN git config --global url."https://github.com/".insteadOf git@github.com:

COPY .eslintrc.js \
  .prettierrc \
  custom.d.ts \
  tsconfig.json \
  jest.config.js \
  babel.config.js \
  package.json \
  package-lock.json \
  app.base.json \
  app.amsterdam.json \
  /app/

RUN npm install

COPY assets /app/assets
COPY internals /app/internals
COPY src /app/src

ARG FRONTEND_TAG
ENV FRONTEND_TAG ${FRONTEND_TAG}

ARG DOMAIN_TAG
ENV DOMAIN_TAG ${DOMAIN_TAG}

ARG BUILD_ENV
ENV BUILD_ENV ${BUILD_ENV}

RUN npm run build

ARG BUILD_NUMBER=0
RUN echo "build ${BUILD_NUMBER} - `date`" > /app/build/version.txt

################################
# Deploy
################################
FROM nginx:stable-alpine

RUN apk add --no-cache jq nodejs yarn

RUN yarn add @exodus/schemasafe lodash

COPY --from=base /app/build/. /usr/share/nginx/html/

COPY default.conf /etc/nginx/conf.d/

COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

COPY app.base.json /app.base.json
COPY app.amsterdam.json /app.amsterdam.json
COPY internals/schemas/app.schema.json /internals/schemas/app.schema.json
COPY internals/scripts/validate-config.js /internals/scripts/validate-config.js
COPY internals/scripts/inject-config.js /internals/scripts/inject-config.js
COPY internals/scripts/helpers/config.js /internals/scripts/helpers/config.js

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
  && ln -sf /dev/stderr /var/log/nginx/error.log

CMD ["/usr/local/bin/start.sh"]
