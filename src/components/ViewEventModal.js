import React, { useState } from 'react';
import { 
  Modal, 
  Typography, 
  Row, 
  Col, 
  Button, 
  Divider,
  Tag,
  Descriptions
} from 'antd';
import SuccessModal from './SuccessModal';
import { 
  EnvironmentOutlined, 
  CalendarOutlined, 
  PictureOutlined,
  VideoCameraOutlined,
  DollarOutlined,
  UserOutlined,
  CloseOutlined,
  CheckCircleFilled
} from '@ant-design/icons';
import './ViewEventModal.css';

const { Title, Text } = Typography;

const ViewEventModal = ({ visible, onCancel, event }) => {
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  // If no event is provided, don't render anything
  if (!event) return null;

  // Extract date and time from the event date string
  const dateTimeParts = event.date ? event.date.split('-') : ['', ''];
  const dateStr = dateTimeParts[0];
  const timeStr = dateTimeParts[1] || '';

  return (
    <Modal
      title={
        <div className="view-modal-header">
          <Title level={4} className="event-title">{event.title}</Title>
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={onCancel} 
            className="close-button"
          />
        </div>
      }
      open={visible}
      footer={null}
      closable={false}
      width={800}
      className="view-event-modal"
      styles={{ body: { padding: 0 } }}
    >
      <div className="event-info-container" style={{marginLeft: 24, marginRight: 24}}>
        <Row gutter={[24, 24]} className="event-info-header">
          <Col xs={24} md={12}>
            <div className="event-date-location">
              <div className="event-info-item">
                <CalendarOutlined className="info-icon" />
                <Text strong>{dateStr} {timeStr}</Text>
              </div>
              <div className="event-info-item">
                <EnvironmentOutlined className="info-icon" />
                <Text>{event.location}</Text>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12} className="register-button-container">
            <Button 
              type="primary" 
              size="large" 
              className={isRegistered ? "registered-button" : "register-button"}
              onClick={() => {
                if (!isRegistered) {
                  setSuccessModalVisible(true);
                }
              }}
              disabled={false}
            >
              {isRegistered ? (
                <>
                  <CheckCircleFilled /> Presença Confirmada
                </>
              ) : "Me Cadastrar"}
            </Button>
          </Col>
        </Row>

        <Divider className="section-divider" />

        <div className="event-details-section">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div className="detail-section">
                <Title level={5} className="section-title">Comissões:</Title>
                <div className="detail-item">
                  <Text strong>Oficial:</Text>
                  <Tag color="#87d068" className="commission-tag">90% fotógrafo</Tag>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="detail-section">
                <Title level={5} className="section-title">Mínima resolução de upload:</Title>
                <Text>3450x2300</Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="detail-section">
                <Title level={5} className="section-title">Lançamento:</Title>
                <Text>23/04/2025 08:25</Text>
              </div>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="mt-24">
            <Col xs={24} md={8}>
              <div className="detail-section">
                <Title level={5} className="section-title">Identificação dos Atletas:</Title>
                <Text>Somente por Detecção Facial</Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="detail-section">
                <Title level={5} className="section-title">Pontos:</Title>
                <Text>10 pontos</Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="detail-section">
                <Title level={5} className="section-title">Fotógrafos:</Title>
                <Text>3</Text>
              </div>
            </Col>
          </Row>
        </div>

        <Divider className="section-divider" />

        <div className="event-pricing-section">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title level={5} className="section-title">Preços de venda</Title>
            </Col>
          </Row>
          <Row gutter={[24, 16]} className="pricing-items">
            <Col xs={24} sm={8}>
              <div className="price-item">
                <VideoCameraOutlined className="price-icon" />
                <Text>Vídeo: R$ 19,90</Text>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="price-item">
                <PictureOutlined className="price-icon" />
                <Text>Alta: R$ 16,90</Text>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="price-item">
                <PictureOutlined className="price-icon" />
                <Text>Baixa: R$ 11,90</Text>
              </div>
            </Col>
          </Row>
        </div>

        <Divider className="section-divider" />

        <div className="event-packages-section">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title level={5} className="section-title">Pacotes</Title>
            </Col>
          </Row>
          <div className="package-items">
            <Tag color="#108ee9" className="package-tag">5%: 3 fotos alta</Tag>
            <Tag color="#108ee9" className="package-tag">10%: 5 fotos alta</Tag>
            <Tag color="#108ee9" className="package-tag">20%: 10 fotos alta</Tag>
          </div>
        </div>
      </div>
      
      {/* Modal de Sucesso */}
      <SuccessModal 
        visible={successModalVisible}
        onClose={() => {
          setSuccessModalVisible(false);
          setIsRegistered(true);
          // Fechar o modal principal após um pequeno delay
          setTimeout(() => {
            onCancel();
          }, 500);
        }}
        title="Cadastro Realizado!"
        message="Você foi cadastrado com sucesso no evento. Você receberá mais informações por e-mail."
      />
    </Modal>
  );
};

export default ViewEventModal;
