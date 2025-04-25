import api from './api';

// Serviço para gerenciar autenticação e operações de usuário
const authService = {
  // Registrar um novo usuário
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erro ao conectar com o servidor' };
    }
  },

  // Login de usuário
  login: async (credentials) => {
    try {
      // Adicionar log para depuração
      console.log('Enviando requisição de login para:', api.defaults.baseURL + '/users/login');
      
      // Usar a rota correta com /api
      const response = await api.post('/api/users/login', credentials);
      
      // Armazenar token e dados do usuário no localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro na requisição de login:', error);
      if (error.response && error.response.data) {
        // Preservar o tipo de erro para tratamento específico no componente
        throw new Error(error.response.data.message || 'Erro ao conectar com o servidor');
      }
      throw new Error('Erro ao conectar com o servidor');
    }
  },

  // Logout de usuário
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Ativar conta de usuário
  activateAccount: async (token) => {
    try {
      const response = await api.get(`/users/activate/${token}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erro ao conectar com o servidor' };
    }
  },

  // Solicitar redefinição de senha
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/users/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erro ao conectar com o servidor' };
    }
  },

  // Redefinir senha
  resetPassword: async (token, password) => {
    try {
      const response = await api.post(`/users/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erro ao conectar com o servidor' };
    }
  },

  // Obter perfil do usuário
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erro ao conectar com o servidor' };
    }
  },

  // Atualizar perfil do usuário
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/profile', userData);
      
      // Atualizar dados do usuário no localStorage
      if (response.data.user) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          ...response.data.user
        }));
      }
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erro ao conectar com o servidor' };
    }
  },

  // Verificar se o usuário está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obter usuário atual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;
