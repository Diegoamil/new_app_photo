import api from './api';

// Serviço para gerenciar operações de usuários
const userService = {
  // Obter todos os usuários
  getAllUsers: async () => {
    try {
      // Obter o token do localStorage
      const token = localStorage.getItem('token');
      console.log('Token de autenticação:', token ? 'Presente' : 'Ausente');
      
      if (!token) {
        throw { message: 'Usuário não autenticado. Faça login para continuar.' };
      }
      
      // Configurar o cabeçalho de autorização
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      console.log('Enviando requisição para:', api.defaults.baseURL + '/users');
      const response = await api.get('/users', config);
      console.log('Resposta recebida:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter usuários:', error);
      throw error.response ? error.response.data : { message: error.message || 'Erro ao conectar com o servidor' };
    }
  },
  
  // Obter um usuário específico
  getUser: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token de autenticação:', token ? 'Presente' : 'Ausente');
      
      if (!token) {
        throw { message: 'Usuário não autenticado. Faça login para continuar.' };
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      console.log('Enviando requisição para:', api.defaults.baseURL + `/users/${userId}`);
      const response = await api.get(`/users/${userId}`, config);
      console.log('Resposta recebida:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      throw error.response ? error.response.data : { message: error.message || 'Erro ao conectar com o servidor' };
    }
  },
  
  // Atualizar um usuário
  updateUser: async (userId, userData) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token de autenticação:', token ? 'Presente' : 'Ausente');
      
      if (!token) {
        throw { message: 'Usuário não autenticado. Faça login para continuar.' };
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      console.log('Enviando requisição para:', api.defaults.baseURL + `/users/${userId}`);
      console.log('Dados do usuário:', userData);
      const response = await api.put(`/users/${userId}`, userData, config);
      console.log('Resposta recebida:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error.response ? error.response.data : { message: error.message || 'Erro ao conectar com o servidor' };
    }
  },
  
  // Ativar/desativar um usuário
  toggleUserStatus: async (userId, active) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token de autenticação:', token ? 'Presente' : 'Ausente');
      
      if (!token) {
        throw { message: 'Usuário não autenticado. Faça login para continuar.' };
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      console.log('Enviando requisição para:', api.defaults.baseURL + `/users/${userId}/status`);
      console.log('Status do usuário:', active);
      const response = await api.put(`/users/${userId}/status`, { active }, config);
      console.log('Resposta recebida:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao ativar/desativar usuário:', error);
      throw error.response ? error.response.data : { message: error.message || 'Erro ao conectar com o servidor' };
    }
  },
  
  // Alterar o papel (role) de um usuário
  changeUserRole: async (userId, role) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token de autenticação:', token ? 'Presente' : 'Ausente');
      
      if (!token) {
        throw { message: 'Usuário não autenticado. Faça login para continuar.' };
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      console.log('Enviando requisição para:', api.defaults.baseURL + `/users/${userId}/role`);
      console.log('Papel do usuário:', role);
      const response = await api.put(`/users/${userId}/role`, { role }, config);
      console.log('Resposta recebida:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar papel do usuário:', error);
      throw error.response ? error.response.data : { message: error.message || 'Erro ao conectar com o servidor' };
    }
  }
};

export default userService;
