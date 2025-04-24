const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const { testConnection } = require('../database');
const userRoutes = require('./routes/userRoutes');

// Criar a aplicação Express
const app = express();

// Configuração CORS para ambiente de desenvolvimento
const corsOptions = {
  origin: '*', // Permite qualquer origem durante o desenvolvimento
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware para logging de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rota de teste
app.get('/api/health', (req, res) => {
  console.log('Rota de saúde acessada');
  res.status(200).json({ message: 'API está funcionando!' });
});

// Rotas da API
app.use('/api/users', userRoutes);
console.log('Rotas de usuários registradas em /api/users');

// Em ambiente de produção, servir os arquivos estáticos do build do React
if (process.env.NODE_ENV === 'production') {
  // Servir arquivos estáticos da pasta build
  app.use(express.static(path.resolve(__dirname, '../../build')));
  
  // Para qualquer rota não encontrada, retornar o index.html
  app.get('*', (req, res, next) => {
    // Se a rota começar com /api, continue para o próximo middleware
    if (req.path.startsWith('/api')) {
      return next();
    }
    
    // Caso contrário, envie o index.html
    res.sendFile(path.resolve(__dirname, '../../build/index.html'));
  });
  
  console.log('Configurado para servir arquivos estáticos do frontend em produção');
}

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Ocorreu um erro no servidor.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Testar a conexão com o banco de dados
    const connectionSuccess = await testConnection();
    
    if (!connectionSuccess) {
      console.error('Não foi possível conectar ao banco de dados. O servidor não será iniciado.');
      process.exit(1);
    }
    
    const server = app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

    // Lidar com sinais de encerramento graciosamente
    process.on('SIGTERM', () => {
      console.log('Recebido sinal SIGTERM, encerrando servidor graciosamente...');
      server.close(() => {
        console.log('Servidor encerrado.');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('Recebido sinal SIGINT, encerrando servidor graciosamente...');
      server.close(() => {
        console.log('Servidor encerrado.');
        process.exit(0);
      });
    });
    
    // Lidar com erros não tratados
    process.on('uncaughtException', (error) => {
      console.error('Erro não tratado:', error);
      server.close(() => {
        console.log('Servidor encerrado devido a erro não tratado.');
        process.exit(1);
      });
    });
    
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

// Exportar a aplicação Express e a função para iniciar o servidor
module.exports = {
  app,
  startServer
};
