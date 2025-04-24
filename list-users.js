// Script para listar todos os usuários cadastrados no banco de dados
require('dotenv').config();
const { sequelize, models } = require('./src/database');
const { User } = models;

async function listAllUsers() {
  try {
    console.log('Conectando ao banco de dados...');
    
    // Verificar conexão com o banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Buscar todos os usuários
    const users = await User.findAll({
      attributes: ['id', 'fullName', 'email', 'phone', 'prefix', 'cpf', 'active', 'role', 'createdAt', 'updatedAt']
    });
    
    console.log('\n===== USUÁRIOS CADASTRADOS =====');
    console.log(`Total de usuários: ${users.length}\n`);
    
    // Exibir informações de cada usuário
    users.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`Nome: ${user.fullName}`);
      console.log(`Email: ${user.email}`);
      console.log(`Telefone: (${user.prefix}) ${user.phone}`);
      console.log(`CPF: ${user.cpf}`);
      console.log(`Status: ${user.active ? 'Ativo' : 'Inativo'}`);
      console.log(`Perfil: ${user.role}`);
      console.log(`Cadastrado em: ${user.createdAt.toLocaleString('pt-BR')}`);
      console.log(`Última atualização: ${user.updatedAt.toLocaleString('pt-BR')}`);
      console.log('-----------------------------------');
    });
    
    // Fechar conexão com o banco de dados
    await sequelize.close();
    console.log('Conexão com o banco de dados fechada.');
    
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
  }
}

// Executar a função
listAllUsers();
