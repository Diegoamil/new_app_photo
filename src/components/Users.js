import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Table, 
  Input, 
  Button, 
  Space, 
  Tag, 
  Avatar, 
  Tooltip, 
  Dropdown,
  Modal,
  Form,
  Select,
  message
} from 'antd';
import { 
  UserOutlined, 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  MoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import userService from '../services/userService';
import './Users.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Carregar usuários do backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        message.error('Não foi possível carregar a lista de usuários. Verifique se você tem permissões de administrador.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Filtrar usuários com base no texto de busca
  const filteredUsers = users.filter(user => {
    const searchLower = searchText.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  // Paginação
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Manipular mudança de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Manipular mudança de tamanho da página
  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Abrir modal para adicionar/editar usuário
  const showModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Fechar modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  // Salvar usuário (adicionar ou editar)
  const handleSave = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        // Editar usuário existente
        const updatedUsers = users.map(user => {
          if (user.id === editingUser.id) {
            return { ...user, ...values };
          }
          return user;
        });
        setUsers(updatedUsers);
        message.success('Usuário atualizado com sucesso!');
      } else {
        // Adicionar novo usuário
        const newUser = {
          id: users.length + 1,
          ...values,
          credits: 0,
          lastLogin: 'Nunca',
          createdAt: new Date().toLocaleDateString('pt-BR')
        };
        setUsers([...users, newUser]);
        message.success('Usuário adicionado com sucesso!');
      }
      
      setIsModalVisible(false);
      setEditingUser(null);
    });
  };

  // Excluir usuário
  const handleDelete = (userId) => {
    Modal.confirm({
      title: 'Tem certeza que deseja excluir este usuário?',
      content: 'Esta ação não pode ser desfeita.',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk() {
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        message.success('Usuário excluído com sucesso!');
      }
    });
  };

  // Alternar status do usuário
  const toggleUserStatus = (user) => {
    const newStatus = user.status === 'Ativo' ? 'Inativo' : 
                      user.status === 'Inativo' ? 'Ativo' : 
                      user.status === 'Bloqueado' ? 'Ativo' : 'Bloqueado';
    
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, status: newStatus };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    message.success(`Usuário ${newStatus.toLowerCase()}.`);
  };

  // Obter o ícone de status apropriado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Ativo':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'Inativo':
        return <CloseCircleOutlined style={{ color: '#faad14' }} />;
      case 'Bloqueado':
        return <LockOutlined style={{ color: '#f5222d' }} />;
      default:
        return null;
    }
  };

  // Obter a cor da tag de status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo':
        return 'green';
      case 'Inativo':
        return 'orange';
      case 'Bloqueado':
        return 'red';
      default:
        return 'default';
    }
  };

  // Obter a cor da tag de função
  const getRoleColor = (role) => {
    switch (role) {
      case 'Administrador':
        return 'blue';
      case 'Fotógrafo':
        return 'purple';
      case 'Cliente':
        return 'cyan';
      default:
        return 'default';
    }
  };

  // Obter iniciais do nome do usuário
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Obter cor do avatar baseada no papel do usuário
  const getAvatarColor = (role) => {
    switch (role) {
      case 'Administrador':
        return '#1890ff';
      case 'Fotógrafo':
        return '#722ed1';
      case 'Cliente':
        return '#13c2c2';
      default:
        return '#d9d9d9';
    }
  };

  // Definir colunas da tabela
  const columns = [
    {
      title: 'Usuário',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="user-info-cell">
          <Avatar 
            style={{ backgroundColor: getAvatarColor(record.role) }}
            className="user-avatar"
          >
            {getInitials(text)}
          </Avatar>
          <div className="user-details">
            <div className="user-name">{text}</div>
            <div className="user-email">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Função',
      dataIndex: 'role',
      key: 'role',
      render: (text) => (
        <Tag color={getRoleColor(text)} className="role-tag">
          {text}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag 
          color={getStatusColor(text)} 
          style={{ 
            padding: '0 10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '4px',
            width: 'fit-content'
          }}
        >
          {getStatusIcon(text)}<span>{text}</span>
        </Tag>
      ),
    },
    {
      title: 'Créditos',
      dataIndex: 'credits',
      key: 'credits',
      render: (text) => (
        <div className="user-credits-cell">
          {text.toLocaleString('pt-BR')}
        </div>
      ),
      sorter: (a, b) => a.credits - b.credits,
    },
    {
      title: 'Último Acesso',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: 'Cadastro',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                icon: <EditOutlined />,
                label: 'Editar',
                onClick: () => showModal(record)
              },
              {
                key: '2',
                icon: record.status === 'Bloqueado' ? <UnlockOutlined /> : <LockOutlined />,
                label: record.status === 'Bloqueado' ? 'Desbloquear' : 'Bloquear',
                onClick: () => toggleUserStatus(record)
              },
              {
                key: '3',
                icon: <DeleteOutlined />,
                label: 'Excluir',
                danger: true,
                onClick: () => handleDelete(record.id)
              }
            ]
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="users-container">
      <div className="users-header">
        <div className="users-header-left">
          <Title level={2}>Usuários</Title>
        </div>
        <div className="users-header-right">
          <Input
            placeholder="Buscar usuários..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            className="add-user-button"
          >
            Novo Usuário
          </Button>
        </div>
      </div>

      <div className="users-table">
        <Table
          dataSource={paginatedUsers}
          columns={columns}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredUsers.length,
            onChange: handlePageChange,
            onShowSizeChange: handlePageSizeChange,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total) => `Total: ${total} usuários`
          }}
          className="custom-users-table"
          loading={loading}
        />
      </div>

      {/* Modal para adicionar/editar usuário */}
      <Modal
        title={editingUser ? "Editar Usuário" : "Novo Usuário"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleSave}>
            {editingUser ? "Atualizar" : "Adicionar"}
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Por favor, informe o nome do usuário' }]}
          >
            <Input placeholder="Nome completo" />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              { required: true, message: 'Por favor, informe o e-mail do usuário' },
              { type: 'email', message: 'E-mail inválido' }
            ]}
          >
            <Input placeholder="email@exemplo.com" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Função"
            rules={[{ required: true, message: 'Por favor, selecione a função do usuário' }]}
          >
            <Select placeholder="Selecione a função">
              <Option value="Administrador">Administrador</Option>
              <Option value="Fotógrafo">Fotógrafo</Option>
              <Option value="Cliente">Cliente</Option>
            </Select>
          </Form.Item>
          {editingUser && (
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Por favor, selecione o status do usuário' }]}
            >
              <Select placeholder="Selecione o status">
                <Option value="Ativo">Ativo</Option>
                <Option value="Inativo">Inativo</Option>
                <Option value="Bloqueado">Bloqueado</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
