import React, { useState, useEffect } from 'react';
import { Modal, Form, Radio, Button, Divider, Row, Col, Typography, Tag, Select } from 'antd';
import { 
  CrownOutlined, 
  CreditCardOutlined, 
  BankOutlined, 
  DollarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import './AddCreditsModal.css';

const { Title, Text } = Typography;
const { Option } = Select;

const AddCreditsModal = ({ visible, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const [selectedCredits, setSelectedCredits] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  // Gerar pacotes de créditos de 1000 em 1000, de 1000 até 15000
  const creditOptions = [];
  for (let i = 1; i <= 15; i++) {
    const points = i * 1000;
    const value = points * 0.5; // R$ 0,50 por crédito
    const bonus = Math.floor(points * 0.1); // 10% de bônus para todos os pacotes
    
    creditOptions.push({
      id: i,
      points: points,
      value: value,
      bonus: bonus
    });
  }

  // Atualizar o pacote selecionado quando o valor do dropdown mudar
  useEffect(() => {
    if (selectedCredits) {
      const pkg = creditOptions.find(pkg => pkg.points === selectedCredits);
      setSelectedPackage(pkg);
    } else {
      setSelectedPackage(null);
    }
  }, [selectedCredits]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onOk({
        ...values,
        package: selectedPackage,
        paymentMethod
      });
      form.resetFields();
      setSelectedCredits(null);
      setSelectedPackage(null);
      setPaymentMethod('credit_card');
    });
  };

  const renderPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card':
        return <CreditCardOutlined />;
      case 'pix':
        return <DollarOutlined />;
      case 'bank_transfer':
        return <BankOutlined />;
      default:
        return <CreditCardOutlined />;
    }
  };

  return (
    <Modal
      title={<div className="modal-title"><CrownOutlined /> Adicionar Créditos</div>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      className="add-credits-modal"
    >
      <Form form={form} layout="vertical">
        <div className="credits-packages">
          <Title level={4} style={{ marginBottom: '8px' }}>Escolha um pacote de créditos</Title>
          <div className="credits-dropdown-container">
            <Select
              placeholder="Selecione a quantidade de créditos"
              style={{ width: '100%' }}
              value={selectedCredits}
              onChange={setSelectedCredits}
              dropdownClassName="credits-dropdown"
            >
              {creditOptions.map(option => (
                <Option key={option.id} value={option.points}>
                  <div className="credit-option">
                    <span className="credit-option-points">
                      <CrownOutlined /> {option.points.toLocaleString('pt-BR')} créditos
                    </span>
                    <span className="credit-option-bonus">
                      {option.bonus > 0 && (
                        <Tag color="green" className="option-bonus-tag">
                          <CheckCircleOutlined /> +{option.bonus.toLocaleString('pt-BR')} bônus
                        </Tag>
                      )}
                    </span>
                    <span className="credit-option-value">
                      R$ {option.value.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div className="payment-methods">
          <Title level={4} style={{ marginBottom: '8px' }}>Forma de pagamento</Title>
          <Radio.Group 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="payment-radio-group"
          >
            <Radio.Button value="credit_card" className="payment-radio-button">
              <CreditCardOutlined /> Cartão de Crédito
            </Radio.Button>
            <Radio.Button value="pix" className="payment-radio-button">
              <DollarOutlined /> PIX
            </Radio.Button>
            <Radio.Button value="bank_transfer" className="payment-radio-button">
              <BankOutlined /> Transferência
            </Radio.Button>
          </Radio.Group>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div className="summary-section">
          <Row justify="space-between" align="middle">
            <Col>
              <Text strong>Resumo da compra</Text>
            </Col>
            <Col>
              {selectedPackage && (
                <div className="summary-details">
                  <div className="summary-points">
                    <CrownOutlined /> {selectedPackage.points} créditos
                    {selectedPackage.bonus > 0 && (
                      <span className="summary-bonus"> + {selectedPackage.bonus} bônus</span>
                    )}
                  </div>
                  <div className="summary-value">
                    Total: R$ {selectedPackage.value.toFixed(2).replace('.', ',')}
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </div>

        <div className="modal-footer">
          <Button onClick={onCancel}>Cancelar</Button>
          <Button 
            type="primary" 
            onClick={handleSubmit}
            disabled={!selectedPackage}
            className="confirm-button"
          >
            {renderPaymentMethodIcon(paymentMethod)} Confirmar Pagamento
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddCreditsModal;
