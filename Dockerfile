FROM gliderlabs/alpine
RUN apk-install nodejs python

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN apk-install -t build-deps build-base python \
 && npm install \
 && npm run build \
 && npm cache clean \
 && apk del --purge build-deps
COPY . /usr/src/app

CMD ["npm", "start"]

