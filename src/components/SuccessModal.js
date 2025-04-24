import React, { useEffect } from 'react';
import { Modal, Typography, Button } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import './SuccessModal.css';

const { Title, Text } = Typography;

const SuccessModal = ({ visible, onClose, title, message }) => {
  useEffect(() => {
    if (visible) {
      // Fechar automaticamente após 2 segundos
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <Modal
      open={visible}
      footer={null}
      closable={false}
      centered
      className="success-modal"
      width={400}
      styles={{ body: { padding: 0 } }}
    >
      <div className="success-content">
        <div className="check-icon-container">
          <CheckCircleFilled className="check-icon" />
        </div>
        <Title level={4} className="success-title">
          {title || 'Sucesso!'}
        </Title>
        <Text className="success-message">
          {message || 'Operação realizada com sucesso.'}
        </Text>
      </div>
    </Modal>
  );
};

export default SuccessModal;
