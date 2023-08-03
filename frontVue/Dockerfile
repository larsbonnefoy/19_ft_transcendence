FROM node:18-alpine as dev



WORKDIR /usr/src/app/

RUN npm install -g http-server

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install glob rimraf vue

RUN npm install
# ENV HOST=0.0.0.0
COPY . .

RUN npm run build

# EXPOSE 5173

EXPOSE 8080

CMD [ "http-server", "dist" ]
