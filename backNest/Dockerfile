# FROM node:fermium-alpine as dev
# RUN apk --update add postgresql-client

# WORKDIR backNest
# COPY package*.json ./

# RUN npm install

# # RUN npm install glob rimraf

# COPY . .

# RUN npm run build

# FROM node:fermium-alpine as prod
# RUN apk --update add postgresql-client

# ARG NODE_ENV=production
# ENV NODE_ENV=dev

# WORKDIR backNest

# COPY package*.json ./

# RUN npm install --production

# COPY . .

# COPY --from=dev backNest/dist ./dist

# CMD ["node", "dist/main"]








# below is the template I used
FROM node:18-alpine as dev
RUN apk --update add postgresql-client

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

RUN npm install glob rimraf 

COPY . .

RUN npm run build

EXPOSE 3000

FROM node:fermium-alpine as prod
RUN apk --update add postgresql-client

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

COPY --from=dev /usr/src/app/dist ./dist

CMD ["node", "dist/main"]