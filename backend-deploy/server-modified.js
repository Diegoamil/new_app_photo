const { startServer } = require('./src/api');
const { sequelize } = require('./src/database/models');

// Função para sincronizar o banco de dados
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Sincronizar os modelos com o banco de dados
    await sequelize.sync();
    console.log('Modelos sincronizados com o banco de dados com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  }
}

// Função principal
async function main() {
  // Sincronizar o banco de dados
  await syncDatabase();
  
  // Iniciar o servidor
  const server = await startServer();
  
  // Tratamento de sinais para encerramento gracioso
  const gracefulShutdown = () => {
    console.log('Recebido sinal de encerramento, encerrando graciosamente...');
    server.close(() => {
      console.log('Servidor HTTP encerrado.');
      sequelize.close().then(() => {
        console.log('Conexão com o banco de dados encerrada.');
        process.exit(0);
      }).catch(err => {
        console.error('Erro ao encerrar conexão com o banco de dados:', err);
        process.exit(1);
      });
    });
    
    // Forçar encerramento após 10 segundos se não conseguir encerrar graciosamente
    setTimeout(() => {
      console.error('Não foi possível encerrar graciosamente após 10s, forçando encerramento');
      process.exit(1);
    }, 10000);
  };
  
  // Registrar handlers para sinais de encerramento
  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
  
  // Handler para erros não tratados
  process.on('uncaughtException', (error) => {
    console.error('Erro não tratado:', error);
    gracefulShutdown();
  });
}

// Executar a função principal
main().catch(error => {
  console.error('Erro na execução principal:', error);
  process.exit(1);
});
