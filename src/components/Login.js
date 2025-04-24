import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Row, Col, message, Alert, Modal } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons';
import authService from '../services/authService';
import './Login.css';

const { Text } = Typography;

const Login = ({ onForgotPassword, onRegister, onLogin }) => {
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showInactiveAlert, setShowInactiveAlert] = useState(false);
  const [inactiveMessage, setInactiveMessage] = useState('');

  const onFinish = async (values) => {
    try {
      // Enviar credenciais para a API
      const response = await authService.login({
        email: values.email,
        password: values.password
      });
      
      console.log('Login bem-sucedido:', response);
      
      // Chamar o callback onLogin, se fornecido
      if (onLogin) {
        onLogin(response.user);
      }
      
      message.success('Login realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      
      // Verificar se é um erro de conta inativa
      if (error.errorType === 'inactive_account') {
        setInactiveMessage(error.message);
        setShowInactiveAlert(true);
      } else {
        message.error(error.message || 'Email ou senha inválidos. Por favor, tente novamente.');
      }
    }
  };

  const handleCloseInactiveAlert = () => {
    setShowInactiveAlert(false);
  };

  return (
    <div className="login-container">
      {showInactiveAlert && (
        <Modal
          title={<span style={{ color: '#ff4d4f' }}><WarningOutlined /> Conta Inativa</span>}
          open={showInactiveAlert}
          onCancel={handleCloseInactiveAlert}
          footer={[
            <Button key="contact" type="primary" danger href="https://wa.me/5511999999999" target="_blank">
              Contatar Suporte via WhatsApp
            </Button>,
            <Button key="close" onClick={handleCloseInactiveAlert}>
              Fechar
            </Button>
          ]}
          width={500}
          centered={true}
          className="inactive-account-modal"
        >
          <Alert
            message="Conta Inativa"
            description={
              <div>
                <p>{inactiveMessage}</p>
                <p>Entre em contato com nossa equipe para ativar sua conta.</p>
              </div>
            }
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        </Modal>
      )}
      
      <Row justify="center" align="middle" className="login-row">
        <Col xs={22} sm={18} md={14} lg={10} xl={8} className="login-form-col">
          <div className="login-form-container">
            <div className="login-logo">
              <div className="logo-container">
                <span className="logo-text">FF</span>
                <div className="logo-by-container">
                  <span className="logo-by">by</span>
                </div>
              </div>
            </div>
            
            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              className="login-form"
            >
              <Form.Item
                label="Login"
                name="email"
                rules={[{ required: true, message: 'Por favor insira seu email!' }]}
              >
                <Input 
                  prefix={<UserOutlined className="site-form-item-icon" />} 
                  placeholder="Email" 
                />
              </Form.Item>

              <Form.Item
                label="Senha"
                name="password"
                rules={[{ required: true, message: 'Por favor insira sua senha!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Senha"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                />
              </Form.Item>

              <Row justify="space-between" align="middle">
                <Col>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox className="remember-me">Lembre-me</Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <Button type="link" className="forgot-password" onClick={onForgotPassword}>
                    Esqueci a senha
                  </Button>
                </Col>
              </Row>

              <Form.Item className="login-button-container">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  className="login-button"
                  style={{ width: '100%' }}
                >
                  Acessar minha conta
                </Button>
              </Form.Item>
            </Form>

            <div className="register-link">
              Não tem uma conta? <Button type="link" className="register-link-text" onClick={onRegister}>Criar uma conta</Button>
            </div>
          </div>
        </Col>
      </Row>
      
      <div className="page-footer">
        <Text className="copyright-text">
          Foco Radical Intermediação e Organização de Eventos Esportivos LTDA
        </Text>
        <Text className="copyright-text">
          Todos os direitos reservados, {new Date().getFullYear()}.
        </Text>
      </div>
    </div>
  );
};

export default Login;
