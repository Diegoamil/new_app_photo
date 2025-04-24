import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

const Dashboard = () => {
  return (
    <div className="content-wrapper">
      <div className="welcome-container">
        <Title level={2}>Bem-vindo ao seu Dashboard</Title>
        <Text className="welcome-text">Gerencie usuários, créditos e eventos da plataforma.</Text>
      </div>
    </div>
  );
};

export default Dashboard;
