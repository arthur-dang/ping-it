<<<<<<< HEAD
FROM node:10.7.0
RUN mkdir -p /front-ping-it
WORKDIR /front-ping-it
=======

FROM node:10.7.0 as builder

RUN mkdir -p /front-pint-it
WORKDIR /front-pint-it
>>>>>>> 46f6a966e17adadad4df65a759ef98163102fd24
ADD ./src ./src
ADD ./public ./public
COPY package.json ./
RUN npm install

EXPOSE 3001

CMD ["npm", "start"]

# production environment
# FROM nginx:1.13.9-alpine
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY --from=builder /front-pint-it/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]