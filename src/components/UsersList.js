import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, message, Spin, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import './UsersList.css';

const { Title } = Typography;

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Obter token do localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          message.error('Usuário não autenticado. Faça login para continuar.');
          setLoading(false);
          return;
        }
        
        // Fazer requisição direta para a API
        const response = await axios.get('http://localhost:5001/api/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Usuários obtidos com sucesso:', response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        message.error('Não foi possível carregar a lista de usuários.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'Usuário',
      key: 'user',
      render: (record) => {
        // Função para gerar iniciais do nome
        const getInitials = (name) => {
          if (!name) return '';
          return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
        };
        
        // Função para gerar uma cor baseada no nome
        const getColorFromName = (name) => {
          const colors = [
            '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
            '#13c2c2', '#eb2f96', '#fa8c16', '#a0d911', '#fadb14'
          ];
          
          if (!name) return colors[0];
          let hash = 0;
          for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
          }
          return colors[Math.abs(hash) % colors.length];
        };
        
        return (
          <div className="user-info-cell" style={{ display: 'flex', alignItems: 'center', padding: '8px 0', width: '100%' }}>
            <Avatar 
              className="user-avatar"
              size={40}
              style={{ 
                backgroundColor: getColorFromName(record.name),
                marginRight: '16px',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '2px solid #fff'
              }}
            >
              {getInitials(record.name)}
            </Avatar>
            <div className="user-details" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', width: 'calc(100% - 56px)' }}>
              <div className="user-name" style={{ 
                fontWeight: 700, 
                fontSize: '15px', 
                color: '#262626', 
                marginBottom: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                letterSpacing: '0.2px'
              }}>
                {record.name}
              </div>
              <div className="user-email" style={{ 
                fontSize: '13px', 
                color: '#8c8c8c',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                letterSpacing: '0.1px'
              }}>
                {record.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Perfil',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'Administrador' ? 'blue' : 'green'}>
          {role}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Ativo' ? 'success' : 'error'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Cadastro',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Usuários Cadastrados</Title>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p>Carregando usuários...</p>
        </div>
      ) : (
        <Table 
          dataSource={users} 
          columns={columns} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default UsersList;
