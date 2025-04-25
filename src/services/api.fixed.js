import axios from 'axios';

// Em produção, usamos a URL relativa para que o proxy reverso do Nginx funcione
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // URL relativa em produção para usar com o proxy reverso
  : 'http://localhost:80/api'; // URL local em desenvolvimento

console.log('API URL configurada para:', API_URL);

// Criar uma instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação às requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
