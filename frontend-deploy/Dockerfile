FROM nginx:alpine

# Copiar os arquivos HTML
COPY frontend-deploy/index.html /usr/share/nginx/html/index.html
COPY frontend-deploy/test.html /usr/share/nginx/html/test.html

# Configuração do Nginx para SPA e proxy reverso
COPY frontend-deploy/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
