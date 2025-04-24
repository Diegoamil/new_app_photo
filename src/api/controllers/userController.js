const { models } = require('../../database');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');

const User = models.User;

// Gerar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'seu_jwt_secret_padrao',
    { expiresIn: '24h' }
  );
};

// Gerar token de ativação
const generateActivationToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Registrar um novo usuário
exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, prefix, cpf, password } = req.body;

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Este email já está em uso.' });
    }

    // Verificar se o CPF já existe
    const existingCpf = await User.findOne({ where: { cpf } });
    if (existingCpf) {
      return res.status(400).json({ message: 'Este CPF já está cadastrado.' });
    }

    // Criar o usuário com conta já ativada
    const user = await User.create({
      fullName,
      email,
      phone,
      prefix,
      cpf,
      password,
      activationToken: null,
      active: true // Ativar automaticamente a conta
    });

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      userId: user.id
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário.', error: error.message });
  }
};

// Ativar conta de usuário
exports.activateAccount = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ where: { activationToken: token } });
    if (!user) {
      return res.status(400).json({ message: 'Token de ativação inválido.' });
    }

    // Ativar a conta do usuário
    user.active = true;
    user.activationToken = null;
    await user.save();

    res.status(200).json({ message: 'Conta ativada com sucesso.' });
  } catch (error) {
    console.error('Erro ao ativar conta:', error);
    res.status(500).json({ message: 'Erro ao ativar conta.', error: error.message });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário pelo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    // Verificar se a conta está ativa
    if (!user.active) {
      return res.status(403).json({ 
        message: 'Conta inativa. Por favor, entre em contato com a equipe da plataforma para ativar sua conta.',
        errorType: 'inactive_account'
      });
    }

    // Verificar senha
    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    // Gerar token JWT
    const token = generateToken(user);

    // Enviar resposta com token
    res.status(200).json({
      message: 'Login realizado com sucesso.',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login.', error: error.message });
  }
};

// Solicitar redefinição de senha
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Gerar token para redefinição de senha
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // Token válido por 1 hora

    // Atualizar usuário com token de redefinição
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    // Aqui você implementaria o envio de email com o link para redefinir a senha
    // Exemplo: await sendResetPasswordEmail(email, resetToken);

    res.status(200).json({ message: 'Instruções para redefinir a senha foram enviadas para o seu email.' });
  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    res.status(500).json({ message: 'Erro ao solicitar redefinição de senha.', error: error.message });
  }
};

// Redefinir senha
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Buscar usuário pelo token de redefinição
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() } // Token ainda válido
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido ou expirado.' });
    }

    // Atualizar senha
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Senha redefinida com sucesso.' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ message: 'Erro ao redefinir senha.', error: error.message });
  }
};

// Obter perfil do usuário
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Obtido do middleware de autenticação

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'activationToken', 'resetPasswordToken', 'resetPasswordExpires'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({ message: 'Erro ao obter perfil.', error: error.message });
  }
};

// Atualizar perfil do usuário
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Obtido do middleware de autenticação
    const { fullName, phone, prefix } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Atualizar dados do usuário
    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;
    user.prefix = prefix || user.prefix;
    await user.save();

    res.status(200).json({
      message: 'Perfil atualizado com sucesso.',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        prefix: user.prefix
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil.', error: error.message });
  }
};

// Obter todos os usuários (apenas para administradores)
exports.getAllUsers = async (req, res) => {
  try {
    // Comentado temporariamente para permitir que qualquer usuário veja a lista
    /*
    // Verificar se o usuário é administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem listar todos os usuários.' });
    }
    */

    // Buscar todos os usuários
    const users = await User.findAll({
      attributes: ['id', 'fullName', 'email', 'phone', 'prefix', 'cpf', 'active', 'role', 'createdAt', 'updatedAt']
    });

    // Formatar os dados para o frontend
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.fullName,
      email: user.email,
      phone: `(${user.prefix}) ${user.phone}`,
      cpf: user.cpf,
      role: user.role === 'admin' ? 'Administrador' : 'Usuário',
      status: user.active ? 'Ativo' : 'Inativo',
      credits: 0, // Implementar lógica de créditos posteriormente
      lastLogin: 'N/A', // Implementar registro de último login posteriormente
      createdAt: user.createdAt.toLocaleDateString('pt-BR')
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários.', error: error.message });
  }
};

// Obter um usuário específico
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o usuário é administrador ou está acessando seu próprio perfil
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Buscar o usuário pelo ID
    const user = await User.findByPk(id, {
      attributes: ['id', 'fullName', 'email', 'phone', 'prefix', 'cpf', 'active', 'role', 'createdAt', 'updatedAt']
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário.', error: error.message });
  }
};

// Atualizar um usuário
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, prefix, cpf } = req.body;

    // Verificar se o usuário é administrador ou está atualizando seu próprio perfil
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Buscar o usuário pelo ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Atualizar os dados do usuário
    await user.update({
      fullName: fullName || user.fullName,
      email: email || user.email,
      phone: phone || user.phone,
      prefix: prefix || user.prefix,
      cpf: cpf || user.cpf
    });

    res.status(200).json({ message: 'Usuário atualizado com sucesso.', user });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário.', error: error.message });
  }
};

// Ativar/desativar um usuário
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    // Verificar se o usuário é administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem alterar o status de usuários.' });
    }

    // Buscar o usuário pelo ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Atualizar o status do usuário
    await user.update({ active });

    res.status(200).json({ 
      message: `Usuário ${active ? 'ativado' : 'desativado'} com sucesso.`,
      user
    });
  } catch (error) {
    console.error('Erro ao alterar status do usuário:', error);
    res.status(500).json({ message: 'Erro ao alterar status do usuário.', error: error.message });
  }
};

// Alterar o papel (role) de um usuário
exports.changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Verificar se o usuário é administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem alterar o papel de usuários.' });
    }

    // Verificar se o papel é válido
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Papel inválido. Os papéis válidos são: user, admin.' });
    }

    // Buscar o usuário pelo ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Atualizar o papel do usuário
    await user.update({ role });

    res.status(200).json({ 
      message: `Papel do usuário alterado para ${role} com sucesso.`,
      user
    });
  } catch (error) {
    console.error('Erro ao alterar papel do usuário:', error);
    res.status(500).json({ message: 'Erro ao alterar papel do usuário.', error: error.message });
  }
};
