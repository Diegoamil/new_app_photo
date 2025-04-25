FROM node:18-alpine as build

WORKDIR /app

# Copiar arquivos de configuração e dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o restante dos arquivos do projeto
COPY . .

# Definir variáveis de ambiente
ENV CI=false
ENV REACT_APP_API_URL=https://api-webfoto-apptest.jy7ldl.easypanel.host

# Construir a aplicação React
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Copiar arquivos de build
COPY --from=build /app/build /usr/share/nginx/html

# Configuração do Nginx para SPA
RUN echo 'server { \
  listen 80; \
  location / { \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
