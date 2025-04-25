// Servidor Express simplificado para teste no Easypanel
const express = require('express');
const cors = require('cors');

// Criar aplicação Express
const app = express();

// Configurar middlewares
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando corretamente!' });
});

// Rota de saúde para verificação
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
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
