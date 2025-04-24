FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o restante dos arquivos do projeto
COPY . .

# Construir a aplicação React
RUN npm run build

# Expor a porta que o servidor usa
EXPOSE 5001

# Comando para iniciar o servidor
CMD ["npm", "run", "server"]
