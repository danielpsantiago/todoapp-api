FROM node:9.5.0

WORKDIR /app

COPY package.json /app
RUN npm install

ADD . /app

RUN npm install forever -g && npm install grunt-cli -g && grunt

EXPOSE 3010

CMD ["node",  "./bin/www"] 