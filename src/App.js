import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import RecoverPassword from './components/RecoverPassword';
import Dashboard from './components/Dashboard';
import Events from './components/Events';
import Credits from './components/Credits';
import Users from './components/Users';
import AppLayout from './components/AppLayout';
import authService from './services/authService';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar se o usuário já está autenticado ao carregar a aplicação
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      setIsAuthenticated(isAuth);
      setUser(currentUser);
      
      if (isAuth) {
        setCurrentPage('dashboard');
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleForgotPassword = () => {
    setCurrentPage('recover');
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
  };

  const handleRegister = () => {
    setCurrentPage('register');
  };

  const handleRegisterSubmit = (values) => {
    console.log('Registro bem-sucedido:', values);
    // Redirecionamento será feito pelo componente Register através do handleLogin
  };

  const handleLogin = (userData) => {
    console.log('Login successful:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentPage('login');
    setUser(null);
  };

  // Handle menu navigation
  const handleMenuClick = (page) => {
    setActivePage(page);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  // If user is authenticated, show appropriate page with shared layout
  if (isAuthenticated && currentPage === 'dashboard') {
    return (
      <AppLayout 
        activePage={activePage} 
        onMenuClick={handleMenuClick} 
        onLogout={handleLogout}
        user={user}
      >
        {activePage === 'events' ? <Events /> : 
         activePage === 'credits' ? <Credits /> : 
         activePage === 'users' ? <Users /> :
         <Dashboard />}
      </AppLayout>
    );
  }

  // Otherwise show login, register or recover password pages
  return (
    <div className="App">
      {currentPage === 'login' ? (
        <Login 
          onForgotPassword={handleForgotPassword} 
          onRegister={handleRegister}
          onLogin={handleLogin}
        />
      ) : currentPage === 'register' ? (
        <Register 
          onRegister={handleRegisterSubmit}
          onLogin={handleLogin}
        />
      ) : (
        <RecoverPassword onBackToLogin={handleBackToLogin} />
      )}
    </div>
  );
}

export default App;
