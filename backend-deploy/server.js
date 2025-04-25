// Servidor Express simplificado para teste no Easypanel
const express = require('express');
const cors = require('cors');

// Criar aplicação Express
const app = express();

// Configurar CORS para permitir requisições do frontend
app.use(cors({
  origin: ['https://webfoto-webfoto-apptest.jy7ldl.easypanel.host', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configurar middlewares
app.use(express.json());

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando corretamente!' });
});

// Rota de saúde para verificação
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Rota de login simulada
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simulação simples de login
  if (email && password) {
    res.status(200).json({
      message: 'Login realizado com sucesso.',
      token: 'token-simulado-123456',
      user: {
        id: 1,
        fullName: 'Usuário Teste',
        email: email,
        role: 'user'
      }
    });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 80;
const server = app.listen(PORT, () => {
  console.log(`Servidor de teste rodando na porta ${PORT}`);
});

// Tratamento de sinais
process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM, encerrando servidor...');
  server.close(() => {
    console.log('Servidor encerrado com sucesso');
    process.exit(0);
  });
  
  // Forçar encerramento após 5 segundos
  setTimeout(() => {
    console.log('Forçando encerramento após timeout');
    process.exit(0);
  }, 5000);
});

process.on('SIGINT', () => {
  console.log('Recebido SIGINT, encerrando servidor...');
  server.close(() => {
    console.log('Servidor encerrado com sucesso');
    process.exit(0);
  });
});
