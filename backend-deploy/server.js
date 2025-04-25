// Servidor Express simplificado para teste no Easypanel
const express = require('express');
const cors = require('cors');

// Criar aplicação Express
const app = express();

// Middleware para adicionar cabeçalhos CORS manualmente
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Responder imediatamente às requisições OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Configurar middlewares
app.use(express.json());

// Rota raiz para informações da API
app.get('/', (req, res) => {
  res.json({
    name: 'WebFoto API',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      { path: '/api/health', description: 'Verificar status da API' },
      { path: '/api/test', description: 'Testar funcionamento da API' },
      { path: '/api/users/login', description: 'Autenticar usuário (POST)' }
    ]
  });
});

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
  console.log('Requisição de login recebida:', req.body);
  
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
