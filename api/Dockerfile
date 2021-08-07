# Stage I - Build dependencies
FROM node:lts as build

#RUN apk update
#for bcrypt dependencies: RUN apk add --update python make g++

WORKDIR /app

COPY  . .

RUN npm install 
RUN npm run build

# Stage II - 
FROM node:lts as prod

RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node --from=build  ./app/build ./build
COPY --chown=node:node package*.json ormconfig.js ./

RUN node --version
RUN npm install --production

EXPOSE 5010 5011

CMD npm run start