# FROM node:18-alpine as dev

# WORKDIR /usr/src/app/

# RUN npm install -g http-server

# COPY package*.json ./
# COPY tsconfig*.json ./

# RUN npm install glob rimraf vue

# RUN npm install
# # ENV HOST=0.0.0.0
# COPY . .

# RUN npm run build

# # EXPOSE 8080

# EXPOSE 8080

# CMD [ "http-server", "dist" ]

FROM debian:bookworm as dev

WORKDIR /usr/src/app

COPY . .

RUN apt-get update
RUN apt-get install -y nginx nodejs npm
# curl vim

# RUN npm install -g n && n 20.3.1
RUN mv nginx.conf /etc/nginx/sites-enabled/default
RUN npm install
RUN chmod +x ./entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]