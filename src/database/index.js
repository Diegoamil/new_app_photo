const { sequelize, testConnection } = require('./config');
const User = require('./models/User');

// Defina as associações entre os modelos aqui, se necessário
// Exemplo: User.hasMany(Post);

// Exporta os modelos e a conexão
module.exports = {
  sequelize,
  testConnection,
  models: {
    User
  }
};
