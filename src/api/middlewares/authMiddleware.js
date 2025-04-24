const jwt = require('jsonwebtoken');
const { models } = require('../../database');

const User = models.User;

module.exports = async (req, res, next) => {
  try {
    // Verificar se o token está presente no cabeçalho Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    // Extrair o token do cabeçalho
    const token = authHeader.split(' ')[1];

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_jwt_secret_padrao');

    // Buscar o usuário pelo ID
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar se a conta está ativa
    if (!user.active) {
      return res.status(401).json({ message: 'Conta não ativada. Verifique seu email.' });
    }

    // Adicionar o usuário ao objeto de requisição
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    // Prosseguir para o próximo middleware ou controlador
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado.' });
    }
    
    res.status(500).json({ message: 'Erro de autenticação.', error: error.message });
  }
};
