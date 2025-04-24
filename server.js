require('dotenv').config();
const { startServer } = require('./src/api');
const syncDatabase = require('./src/database/syncDatabase');

// Sincronizar o banco de dados e iniciar o servidor
const init = async () => {
  try {
    // Sincronizar modelos com o banco de dados
    await syncDatabase();
    
    // Iniciar o servidor
    startServer();
  } catch (error) {
    console.error('Erro ao inicializar a aplicação:', error);
    process.exit(1);
  }
};

init();
