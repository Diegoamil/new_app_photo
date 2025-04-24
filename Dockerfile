FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de configuração e dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o restante dos arquivos do projeto
COPY . .

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV CI=false
ENV PORT=5001

# Construir a aplicação React
RUN npm run build

# Expor a porta que o servidor usa
EXPOSE 5001

# Comando para iniciar o servidor
CMD ["node", "server.js"]
