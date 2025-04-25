FROM node:18-alpine as build

WORKDIR /app

# Copiar arquivos de configuração e dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o restante dos arquivos do projeto
COPY . .

# Substituir o arquivo api.js pelo arquivo corrigido
RUN cp src/services/api.fixed.js src/services/api.js

# Definir variáveis de ambiente
ENV CI=false
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Construir a aplicação React
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Copiar arquivos de build
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuração personalizada do Nginx
COPY frontend-deploy/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
