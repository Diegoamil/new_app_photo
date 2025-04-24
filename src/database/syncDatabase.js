const { sequelize, testConnection, models } = require('./index');

const syncDatabase = async () => {
  try {
    // Testa a conexão com o banco de dados
    const connectionSuccess = await testConnection();
    
    if (!connectionSuccess) {
      console.error('Não foi possível conectar ao banco de dados. Verifique suas configurações.');
      return;
    }
    
    // Sincroniza os modelos com o banco de dados
    // force: true vai dropar as tabelas e recriá-las (use com cuidado em produção)
    // alter: true atualiza as tabelas existentes para corresponder aos modelos
    await sequelize.sync({ alter: true });
    
    console.log('Modelos sincronizados com o banco de dados com sucesso.');
  } catch (error) {
    console.error('Erro ao sincronizar modelos com o banco de dados:', error);
  }
};

// Executa a sincronização se este arquivo for executado diretamente
if (require.main === module) {
  syncDatabase();
}

module.exports = syncDatabase;
