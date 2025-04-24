FROM node:18-alpine

WORKDIR /app

# Instalar PM2 globalmente
RUN npm install -g pm2

# Copiar arquivos de configuração e dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o restante dos arquivos do projeto
COPY . .

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV CI=false
ENV PORT=80

# Construir a aplicação React
RUN npm run build

# Expor a porta que o servidor usa
EXPOSE 80

# Criar arquivo de configuração do PM2
RUN echo '{\n  "apps": [{\n    "name": "app",\n    "script": "server.js",\n    "instances": 1,\n    "autorestart": true,\n    "watch": false,\n    "max_memory_restart": "1G",\n    "env": {\n      "NODE_ENV": "production",\n      "PORT": 80\n    }\n  }]\n}' > ecosystem.config.json

# Comando para iniciar o servidor usando PM2
CMD ["pm2-runtime", "ecosystem.config.json"]
