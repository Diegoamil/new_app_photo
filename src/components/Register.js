import React, { useState, useRef } from 'react';
import { Form, Input, Button, Checkbox, Typography, Row, Col, Select, message, Modal, Result } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined, MailOutlined, IdcardOutlined, PhoneOutlined } from '@ant-design/icons';
import RocketIcon from './RocketIcon';
import authService from '../services/authService';
import './Register.css';

const { Text, Title } = Typography;
const { Option } = Select;

const Register = ({ onRegister, onLogin }) => {
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 100,
        }}
        popupMatchSelectWidth={false}
      >
        <Option value="55">
          <span role="img" aria-label="Brasil">
            🇧🇷
          </span>
          {' +55'}
        </Option>
        <Option value="1">
          <span role="img" aria-label="EUA">
            🇺🇸
          </span>
          {' +1'}
        </Option>
        <Option value="351">
          <span role="img" aria-label="Portugal">
            🇵🇹
          </span>
          {' +351'}
        </Option>
      </Select>
    </Form.Item>
  );

  const phoneInputRef = useRef(null);
  const cpfInputRef = useRef(null);

  const handlePhoneInputChange = (e) => {
    const { value } = e.target;
    const formattedValue = value.replace(/\D+/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{1})(\d{4})/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
    
    // Set the formatted value and maintain cursor position
    const cursorPosition = e.target.selectionStart;
    const lengthDiff = formattedValue.length - value.length;
    
    form.setFieldValue('phone', formattedValue);
    
    // Set timeout to ensure the DOM has updated
    setTimeout(() => {
      if (phoneInputRef.current) {
        phoneInputRef.current.setSelectionRange(
          cursorPosition + (lengthDiff > 0 ? lengthDiff : 0),
          cursorPosition + (lengthDiff > 0 ? lengthDiff : 0)
        );
      }
    }, 0);
  };

  const handleCpfInputChange = (e) => {
    const { value } = e.target;
    const formattedValue = value.replace(/\D+/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
    
    // Set the formatted value and maintain cursor position
    const cursorPosition = e.target.selectionStart;
    const lengthDiff = formattedValue.length - value.length;
    
    form.setFieldValue('cpf', formattedValue);
    
    // Set timeout to ensure the DOM has updated
    setTimeout(() => {
      if (cpfInputRef.current) {
        cpfInputRef.current.setSelectionRange(
          cursorPosition + (lengthDiff > 0 ? lengthDiff : 0),
          cursorPosition + (lengthDiff > 0 ? lengthDiff : 0)
        );
      }
    }, 0);
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      // Preparar dados do usuário
      const userData = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone.replace(/\D/g, ''), // Remover caracteres não numéricos
        prefix: values.prefix,
        cpf: values.cpf.replace(/\D/g, ''), // Remover caracteres não numéricos
        password: values.password
      };
      
      // Enviar dados para a API
      await authService.register(userData);
      
      // Fazer login automaticamente após o cadastro
      const loginResponse = await authService.login({
        email: userData.email,
        password: userData.password
      });
      
      // Chamar o callback onRegister, se fornecido
      if (onRegister) {
        onRegister(loginResponse.user);
      }
      
      message.success('Cadastro realizado com sucesso!');
      
      // Redirecionar para o dashboard
      if (onLogin) {
        onLogin(loginResponse.user);
      }
      
    } catch (error) {
      console.error('Erro ao registrar:', error);
      message.error(error.message || 'Erro ao registrar. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // If registration is successful, show the success message
  if (registrationSuccess) {
    return (
      <div className="register-container">
        <Row justify="center" align="middle" className="register-row">
          <Col xs={22} sm={18} md={14} lg={10} xl={8} className="register-form-col">
            <div className="register-form-container">
              <div className="register-logo">
                <div className="logo-container">
                  <span className="logo-text">FF</span>
                  <div className="logo-by-container">
                    <span className="logo-by">by</span>
                  </div>
                </div>
              </div>
              
              <div className="success-content">
                <div className="success-icon">
                  <RocketIcon className="rocket-icon" />
                </div>
                
                <Title level={2} className="success-title">
                  Obrigado por se <span className="highlight-text">cadastrar</span> em nossa <span className="highlight-text">plataforma!</span>
                </Title>
                
                <div className="success-message">
                  <Text>
                    Em até <span className="highlight-text">2 dias úteis</span> você receberá por <span className="highlight-text">e-mail</span> o link para finalizar seu <span className="highlight-text">cadastro</span>.
                  </Text>
                  <Text>
                    Caso não identifique na caixa de entrada, verifique no spam. Estamos ansiosos para iniciar essa <span className="highlight-text">jornada junto com você!</span>
                  </Text>
                </div>
                
                <Button 
                  type="primary" 
                  size="large" 
                  className="login-button"
                  onClick={() => window.location.reload()}
                >
                  Voltar para Login
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="register-container">
      <Row justify="center" align="middle" className="register-row">
        <Col xs={22} sm={18} md={14} lg={10} xl={8} className="register-form-col">
          <div className="register-form-container">
            <div className="register-logo">
              <div className="logo-container">
                <span className="logo-text">FF</span>
                <div className="logo-by-container">
                  <span className="logo-by">by</span>
                </div>
              </div>
            </div>
            
            <Title level={2} className="register-title">Criar uma conta</Title>
            
            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              layout="vertical"
              className="register-form"
              scrollToFirstError
              initialValues={{
                prefix: '55',
              }}
            >
              <div className="form-section">
                <Title level={5} className="section-title">Dados Cadastrais</Title>
                <Text type="secondary" className="required-fields">*Campos obrigatórios</Text>
                
                <Form.Item
                  label="Nome completo*"
                  name="fullName"
                  rules={[{ required: true, message: 'Por favor insira seu nome completo!' }]}
                >
                  <Input placeholder="Digite seu nome completo" />
                </Form.Item>

                <Form.Item
                  label="Seu Whatsapp*"
                  name="phone"
                  rules={[{ required: true, message: 'Por favor insira seu número de Whatsapp!' }]}
                  className="whatsapp-input-container"
                >
                  <Input
                    ref={phoneInputRef}
                    addonBefore={prefixSelector}
                    placeholder="Digite seu Whatsapp"
                    style={{ width: '100%' }}
                    onChange={handlePhoneInputChange}
                  />
                </Form.Item>

                <Form.Item
                  label="CPF*"
                  name="cpf"
                  rules={[
                    { required: true, message: 'Por favor insira seu CPF!' },
                    { 
                      validator: (_, value) => {
                        if (value && value.replace(/[^\d]/g, '').length === 11) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Por favor preencha o CPF completamente!'));
                      },
                    }
                  ]}
                >
                  <Input
                    ref={cpfInputRef}
                    placeholder="___.___.___-__"
                    onChange={handleCpfInputChange}
                  />
                </Form.Item>
              </div>

              <div className="form-section">
                <Title level={5} className="section-title">Dados de Acesso</Title>
                
                <Form.Item
                  label="E-mail*"
                  name="email"
                  rules={[
                    { required: true, message: 'Por favor insira seu e-mail!' },
                    { type: 'email', message: 'E-mail inválido!' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined className="site-form-item-icon" />} 
                    placeholder="Digite seu e-mail" 
                  />
                </Form.Item>

                <Form.Item
                  label="Senha*"
                  name="password"
                  rules={[{ required: true, message: 'Por favor insira sua senha!' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Digite sua senha"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                  />
                </Form.Item>

                <Form.Item
                  label="Repetir senha"
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Por favor confirme sua senha!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('As senhas não correspondem!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Confirme sua senha"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    visibilityToggle={{ visible: confirmPasswordVisible, onVisibleChange: setConfirmPasswordVisible }}
                  />
                </Form.Item>
              </div>

              <div className="form-section">
                <Title level={5} className="section-title">Política de Privacidade</Title>
                
                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value ? Promise.resolve() : Promise.reject(new Error('Você deve aceitar os termos e a política de privacidade')),
                    },
                  ]}
                >
                  <Checkbox className="agreement-checkbox">
                    Ao clicar em "Criar conta", você aceita os <button type="button" style={{ background: 'none', border: 'none', padding: 0, color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }}>Termos de Uso</button> e confirma que leu nossa <button type="button" style={{ background: 'none', border: 'none', padding: 0, color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }}>Política de Privacidade</button>. Eu Também autorizo a Foco Radical a enviar e-mails, incluindo por meios automatizados, para fins informativos e/ou de marketing. A autorização para o envio de mensagens de marketing não é uma condição para utilizar os serviços da Foco Radical. Compreende que pode cancelar estas comunicações no rodapé do e-mail recebido.
                  </Checkbox>
                </Form.Item>

                <Form.Item className="register-button-container" style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    className="register-button"
                    style={{ width: '100%', display: 'block' }}
                    block
                    loading={loading}
                  >
                    Cadastre-se
                  </Button>
                </Form.Item>
              </div>
            </Form>

            <div className="login-link">
              Já tem uma conta? <Button type="link" className="login-link-text" onClick={() => window.location.href = '/login'}>Fazer login</Button>
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

export default Register;
