FROM nginx:1.12
WORKDIR /front-end/formulavis
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./frontend/formulavis/dist /front-end/formulavis
EXPOSE 80


