import React, { useState } from 'react';
import { Form, Input, Button, Typography, Row, Col, Alert } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import authService from '../services/authService';
import './RecoverPassword.css';

const { Text } = Typography;

const RecoverPassword = ({ onBackToLogin }) => {
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      // Enviar solicitação de recuperação de senha para a API
      await authService.forgotPassword(values.email);
      
      console.log('Recovery request sent for:', values.email);
      setEmail(values.email);
      setSubmitted(true);
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      // Exibir mensagem de erro usando o componente Alert
      form.setFields([
        {
          name: 'email',
          errors: [error.message || 'Erro ao solicitar recuperação de senha. Por favor, tente novamente.']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recover-container">
      <Row justify="center" align="middle" className="recover-row">
        <Col xs={22} sm={16} md={12} lg={8} xl={6} className="recover-form-col">
          <div className="recover-form-container">
            <div className="recover-logo">
              <div className="logo-container">
                <span className="logo-text">FF</span>
                <div className="logo-by-container">
                  <span className="logo-by">by</span>
                </div>
              </div>
            </div>
            
            {!submitted ? (
              <>
                <div className="recover-header">
                  <h2>Recuperar Senha</h2>
                  <p>Digite seu e-mail para receber um link de recuperação de senha</p>
                </div>
                
                <Form
                  form={form}
                  name="recover"
                  onFinish={onFinish}
                  layout="vertical"
                  className="recover-form"
                >
                  <Form.Item
                    label="E-mail"
                    name="email"
                    rules={[
                      { required: true, message: 'Por favor insira seu e-mail!' },
                      { type: 'email', message: 'Por favor insira um e-mail válido!' }
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined className="site-form-item-icon" />} 
                      placeholder="Seu e-mail" 
                    />
                  </Form.Item>

                  <Form.Item className="recover-button-container">
                    <Button type="primary" htmlType="submit" className="recover-button" loading={loading}>
                      Enviar link de recuperação
                    </Button>
                  </Form.Item>
                </Form>
              </>
            ) : (
              <div className="recover-success">
                <Alert
                  message="E-mail enviado com sucesso!"
                  description={`Um link de recuperação de senha foi enviado para ${email}. Por favor, verifique sua caixa de entrada.`}
                  type="success"
                  showIcon
                />
              </div>
            )}
            
            <div className="back-to-login">
              <Button 
                type="link" 
                icon={<ArrowLeftOutlined />} 
                onClick={onBackToLogin}
                className="back-button"
              >
                Voltar para o login
              </Button>
            </div>

            <div className="recover-footer">
              <Text className="copyright-text">
                Foco Radical Intermediação e Organização de Eventos Esportivos LTDA
              </Text>
              <Text className="copyright-text">
                Todos os direitos reservados, {new Date().getFullYear()}.
              </Text>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default RecoverPassword;
