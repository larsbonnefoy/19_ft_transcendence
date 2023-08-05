FROM node:18-alpine as dev

RUN apk add nginx openssl
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
#RUN npm install -g http-server

WORKDIR /usr/src/app/

COPY package*.json ./
COPY tsconfig*.json ./
COPY frontVue_nginx.conf /etc/nginx/sites-available/

RUN npm install glob rimraf vue

RUN npm install
# ENV HOST=0.0.0.0
COPY . .

RUN npm run build

RUN cp -rf ./dist /usr/share/nginx/html
# EXPOSE 5173

EXPOSE 8080

#CMD [ "http-server", "dist" ]
CMD ["nginx", "-g", "daemon off;"]
