FROM gliderlabs/alpine
RUN apk-install nodejs

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN apk-install -t build-deps build-base python \
  && npm install \
  && npm run build \
  && npm cache clean \
  && apk del --purge build-deps \
  && rm -rf node_modules/babel node_modules/.bin

CMD ["npm", "start"]
