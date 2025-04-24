import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Dropdown, Avatar } from 'antd';
import { 
  HomeOutlined, 
  ShopOutlined, 
  CalendarOutlined, 
  TagOutlined, 
  BankOutlined, 
  UserOutlined, 
  TrophyOutlined, 
  CreditCardOutlined, 
  DownloadOutlined, 
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  WalletOutlined,
  CrownOutlined
} from '@ant-design/icons';
import './Dashboard.css'; 

const { Sider, Content } = Layout;
const { Text } = Typography;

const getRandomColor = () => {
  const colors = [
    '#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#712fd1',
    '#04be7e', '#f44336', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688',
    '#4caf50', '#8bc34a', '#cddc39', '#ffc107', '#ff9800'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const AppLayout = ({ children, activePage, onMenuClick, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Usuário',
    email: '',
    role: 'user',
    credits: 0
  });
  
  // Carregar dados do usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log('Dados do usuário carregados:', user);
        setUserData({
          name: user.fullName || user.name || 'Usuário',
          email: user.email || '',
          role: user.role || 'user',
          credits: user.credits || 0
        });
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    } else {
      // Se não houver usuário no localStorage, tentar obter do token
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Decodificar o token JWT para obter informações básicas
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const decodedToken = JSON.parse(jsonPayload);
          console.log('Dados do token decodificado:', decodedToken);
          
          // Buscar dados completos do usuário da API
          fetch('http://localhost:5001/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then(response => response.json())
          .then(data => {
            console.log('Dados do perfil obtidos da API:', data);
            setUserData({
              name: data.fullName || data.name || decodedToken.fullName || decodedToken.name || 'Usuário',
              email: data.email || decodedToken.email || '',
              role: data.role || decodedToken.role || 'user',
              credits: data.credits || 0
            });
          })
          .catch(error => {
            console.error('Erro ao buscar perfil do usuário:', error);
          });
        } catch (error) {
          console.error('Erro ao decodificar token:', error);
        }
      }
    }
  }, []);
  
  const avatarColor = getRandomColor();
  const userInitials = getInitials(userData.name);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="dashboard-layout">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="dashboard-sider"
        width={220}
      >
        <div className="logo-container">
          {!collapsed && <span className="logo-text">fotos<span className="logo-by">by</span></span>}
          <div className="sidebar-collapse-button">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'sidebar-trigger',
              onClick: toggleCollapsed,
            })}
          </div>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[activePage === 'dashboard' ? '1' : activePage === 'events' ? '3' : activePage === 'credits' ? '8' : '1']}
          className="sidebar-menu"
          onClick={({ key }) => {
            if (key === '1') {
              onMenuClick('dashboard');
            } else if (key === '3') {
              onMenuClick('events');
            } else if (key === '8') {
              onMenuClick('credits');
            } else if (key === '10') {
              onMenuClick('users');
            }
          }}
          items={[
            {
              key: '1',
              icon: <HomeOutlined />,
              label: 'Início',
            },
            {
              key: '2',
              icon: <ShopOutlined />,
              label: 'Minhas Lojas',
            },
            {
              key: '3',
              icon: <CalendarOutlined />,
              label: 'Eventos',
            },
            {
              key: '4',
              icon: <TagOutlined />,
              label: 'Cupons de Desconto',
            },
            {
              key: '5',
              icon: <BankOutlined />,
              label: 'Financeiro',
            },
            {
              key: '6',
              icon: <UserOutlined />,
              label: 'Perfil',
            },
            {
              key: '7',
              icon: <TrophyOutlined />,
              label: 'Ranking',
            },
            {
              key: '8',
              icon: <CreditCardOutlined />,
              label: 'Meus créditos',
            },
            {
              key: '9',
              icon: <DownloadOutlined />,
              label: 'Download',
            },
            {
              key: '10',
              icon: <UserOutlined />,
              label: 'Usuários',
            },
          ]}
        />
        
        <div className="sidebar-footer">
          <Dropdown
            menu={{
              items: [
                {
                  key: 'profile',
                  icon: <UserOutlined />,
                  label: 'Meu Perfil',
                  onClick: () => onMenuClick('profile')
                },
                {
                  key: 'credits',
                  icon: <WalletOutlined />,
                  label: 'Meus Créditos',
                  onClick: () => onMenuClick('credits')
                },
                {
                  type: 'divider'
                },
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'Sair',
                  danger: true,
                  onClick: onLogout
                }
              ]
            }}
            trigger={['click']}
            placement="topRight"
          >
            <div 
              className="sidebar-user-info" 
              style={{ 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                width: '100%',
                borderRadius: '4px',
                transition: 'background-color 0.3s'
              }}
            >
              <Avatar 
                size={collapsed ? "small" : "default"}
                style={{ 
                  backgroundColor: avatarColor, 
                  color: '#fff', 
                  flexShrink: 0 
                }}
              >
                {userInitials}
              </Avatar>
              
              {!collapsed && (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  overflow: 'hidden',
                  width: '100%',
                  minWidth: 0
                }}>
                  <div style={{ 
                    fontWeight: 600,
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: '#fff',
                    letterSpacing: '0.2px',
                    marginBottom: '6px',
                    width: '100%',
                    display: 'block'
                  }}>
                    {userData.name}
                  </div>
                  <div style={{ 
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#52c41a',
                    backgroundColor: 'rgba(82, 196, 26, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    border: '1px solid rgba(82, 196, 26, 0.3)',
                    maxWidth: 'fit-content'
                  }}>
                    <CrownOutlined style={{ fontSize: '12px' }} /> {userData.credits}
                  </div>
                </div>
              )}
            </div>
          </Dropdown>
        </div>
      </Sider>
      
      <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 220 }}>
        <Content className="dashboard-content full-width">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
