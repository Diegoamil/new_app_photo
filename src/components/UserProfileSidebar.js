import React, { useState, useEffect } from 'react';
import { Avatar } from 'antd';
import { CrownOutlined } from '@ant-design/icons';

// Função para gerar uma cor aleatória
const getRandomColor = () => {
  const colors = [
    '#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#712fd1',
    '#04be7e', '#f44336', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688',
    '#4caf50', '#8bc34a', '#cddc39', '#ffc107', '#ff9800'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Função para obter iniciais de um nome
const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const UserProfileSidebar = ({ collapsed }) => {
  const [userData, setUserData] = useState({
    name: 'Usuário',
    email: '',
    role: 'user',
    credits: 0
  });
  
  const [avatarColor] = useState(getRandomColor());
  
  // Carregar dados do usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserData({
          name: user.name || 'Usuário',
          email: user.email || '',
          role: user.role || 'user',
          credits: user.credits || 0
        });
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    }
  }, []);

  const userInitials = getInitials(userData.name);

  // Estilos inline para garantir a exibição correta
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '12px 0',
    cursor: 'pointer',
    gap: '12px'
  };

  const userDetailsStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: collapsed ? '0' : '100%',
    overflow: 'hidden',
    opacity: collapsed ? 0 : 1,
    transition: 'opacity 0.3s'
  };

  const userNameStyle = {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: '4px',
    display: 'block',
    width: '100%'
  };

  const userCreditsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#52c41a',
    backgroundColor: 'rgba(82, 196, 26, 0.1)',
    padding: '2px 6px',
    borderRadius: '4px',
    maxWidth: 'fit-content',
    border: '1px solid rgba(82, 196, 26, 0.2)'
  };

  return (
    <div 
      style={containerStyle}
      className="sidebar-user-info"
    >
      <Avatar 
        size={collapsed ? "small" : "default"}
        style={{ backgroundColor: avatarColor, color: '#fff', flexShrink: 0 }}
      >
        {userInitials}
      </Avatar>
      
      {!collapsed && (
        <div style={userDetailsStyle}>
          <div style={userNameStyle}>
            {userData.name}
          </div>
          <div style={userCreditsStyle}>
            <CrownOutlined /> {userData.credits}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileSidebar;
