FROM nginx:latest

#COPY ./website/index.html /usr/share/nginx/html/index.html
#COPY ./website/ftm.css /usr/share/nginx/html/ftm.css
#COPY ./website/ftm.js /usr/share/nginx/html/ftm.js

ADD website /usr/share/nginx/html

