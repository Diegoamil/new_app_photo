FROM node:18-alpine

WORKDIR /app

# Copiar apenas os arquivos necessários para o backend
COPY backend-deploy/server.js ./server.js
COPY package*.json ./

# Instalar apenas as dependências necessárias
RUN npm install express cors

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=80

# Expor a porta que o servidor usa
EXPOSE 80

# Comando para iniciar o servidor simplificado
CMD ["node", "server.js"]
