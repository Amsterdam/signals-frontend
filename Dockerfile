FROM node:8.1

MAINTAINER datapunt.ois@amsterdam.nl

EXPOSE 80

RUN apt-get update \
  && apt-get install -y git nginx build-essential openjdk-7-jre \
  && apt-get clean \
  && mkdir /app

WORKDIR /app
COPY *.json /app/

RUN npm install

COPY . /app/

RUN npm run build \
  && cp -r /app/build/. /var/www/html/

COPY default.conf /etc/nginx/conf.d/
RUN rm /etc/nginx/sites-enabled/default

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
	&& ln -sf /dev/stderr /var/log/nginx/error.log

CMD ["nginx", "-g", "daemon off;"]
