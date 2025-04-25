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
ENV PORT=80

# Construir a aplicação React
RUN npm run build

# Tornar o script de inicialização executável
RUN chmod +x start.sh

# Expor a porta que o servidor usa
EXPOSE 80

# Comando para iniciar o servidor usando o script shell
CMD ["./start.sh"]
