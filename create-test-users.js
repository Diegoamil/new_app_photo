// Script para adicionar usuários de teste ao banco de dados
require('dotenv').config();
const { sequelize, models } = require('./src/database');
const { User } = models;
const bcrypt = require('bcryptjs');

// Lista de usuários de teste para adicionar
const testUsers = [
  {
    fullName: 'Maria Silva',
    email: 'maria.silva@exemplo.com',
    phone: '11987654321',
    prefix: '55',
    cpf: '98765432101',
    password: '123456',
    active: true,
    role: 'user'
  },
  {
    fullName: 'João Oliveira',
    email: 'joao.oliveira@exemplo.com',
    phone: '21987654321',
    prefix: '55',
    cpf: '12345678901',
    password: '123456',
    active: false, // Usuário inativo para testar o alerta
    role: 'user'
  },
  {
    fullName: 'Ana Souza',
    email: 'ana.souza@exemplo.com',
    phone: '31987654321',
    prefix: '55',
    cpf: '45678912301',
    password: '123456',
    active: true,
    role: 'admin' // Usuário administrador
  },
  {
    fullName: 'Carlos Pereira',
    email: 'carlos.pereira@exemplo.com',
    phone: '41987654321',
    prefix: '55',
    cpf: '78912345601',
    password: '123456',
    active: true,
    role: 'user'
  },
  {
    fullName: 'Fernanda Lima',
    email: 'fernanda.lima@exemplo.com',
    phone: '51987654321',
    prefix: '55',
    cpf: '32165498701',
    password: '123456',
    active: true,
    role: 'user'
  }
];

async function createTestUsers() {
  try {
    console.log('Conectando ao banco de dados...');
    
    // Verificar conexão com o banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    console.log('\nCriando usuários de teste...');
    
    // Contador de usuários criados
    let createdCount = 0;
    let skippedCount = 0;
    
    // Criar cada usuário de teste
    for (const userData of testUsers) {
      try {
        // Verificar se o usuário já existe pelo email
        const existingUser = await User.findOne({ where: { email: userData.email } });
        if (existingUser) {
          console.log(`Usuário com email ${userData.email} já existe. Pulando...`);
          skippedCount++;
          continue;
        }
        
        // Verificar se o CPF já existe
        const existingCpf = await User.findOne({ where: { cpf: userData.cpf } });
        if (existingCpf) {
          console.log(`Usuário com CPF ${userData.cpf} já existe. Pulando...`);
          skippedCount++;
          continue;
        }
        
        // Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        // Criar o usuário
        const user = await User.create({
          ...userData,
          password: hashedPassword
        });
        
        console.log(`Usuário criado: ${user.fullName} (${user.email})`);
        createdCount++;
        
      } catch (error) {
        console.error(`Erro ao criar usuário ${userData.email}:`, error.message);
      }
    }
    
    console.log(`\nResumo: ${createdCount} usuários criados, ${skippedCount} pulados.`);
    
    // Fechar conexão com o banco de dados
    await sequelize.close();
    console.log('Conexão com o banco de dados fechada.');
    
  } catch (error) {
    console.error('Erro ao criar usuários de teste:', error);
  }
}

// Executar a função
createTestUsers();
