FROM node:18-alpine

WORKDIR /app

# Copiar apenas os arquivos necessários para o backend
COPY package*.json ./
COPY server.js ./
COPY src/api ./src/api
COPY src/database ./src/database
COPY .env.production ./.env

# Instalar apenas as dependências necessárias para o backend
RUN npm ci --only=production

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=80

# Expor a porta que o servidor usa
EXPOSE 80

# Comando para iniciar o servidor
CMD ["node", "server.js"]
