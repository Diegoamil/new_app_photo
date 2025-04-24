import React, { useState, useEffect } from 'react';
import { Typography, Input, Select, Row, Col, Table, Button, Tag, Space, Tooltip, message } from 'antd';
import AddCreditsModal from './AddCreditsModal';
import { 
  WalletOutlined, 
  FilterOutlined, 
  PlusOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  CreditCardOutlined,
  BankOutlined,
  CrownOutlined
} from '@ant-design/icons';
import './Credits.css';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const Credits = () => {
  const [searchId, setSearchId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isAddCreditsModalVisible, setIsAddCreditsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [creditsList, setCreditsList] = useState([]);
  const [totalCredits, setTotalCredits] = useState(1000);
  
  // Set credits list on component mount
  useEffect(() => {
    // Initialize with sample data
    setCreditsList([
      {
        id: 'CR-2025-001',
        points: 100,
        value: 'R$ 50,00',
        paymentMethod: 'Cartão de Crédito',
        status: 'Aprovado',
        date: '23/04/2025'
      },
      {
        id: 'CR-2025-002',
        points: 200,
        value: 'R$ 100,00',
        paymentMethod: 'PIX',
        status: 'Aprovado',
        date: '15/04/2025'
      },
      {
        id: 'CR-2025-003',
        points: 500,
        value: 'R$ 250,00',
        paymentMethod: 'Boleto',
        status: 'Aprovado',
        date: '10/04/2025'
      },
      {
        id: 'CR-2025-004',
        points: 300,
        value: 'R$ 150,00',
        paymentMethod: 'Cartão de Crédito',
        status: 'Pendente',
        date: '05/04/2025'
      },
      {
        id: 'CR-2025-005',
        points: 200,
        value: 'R$ 100,00',
        paymentMethod: 'PIX',
        status: 'Recusado',
        date: '01/04/2025'
      },
      {
        id: 'CR-2025-006',
        points: 1000,
        value: 'R$ 500,00',
        paymentMethod: 'Transferência',
        status: 'Aprovado',
        date: '25/03/2025'
      },
      {
        id: 'CR-2025-007',
        points: 400,
        value: 'R$ 200,00',
        paymentMethod: 'Cartão de Crédito',
        status: 'Aprovado',
        date: '20/03/2025'
      },
      {
        id: 'CR-2025-008',
        points: 150,
        value: 'R$ 75,00',
        paymentMethod: 'PIX',
        status: 'Aprovado',
        date: '15/03/2025'
      },
      {
        id: 'CR-2025-009',
        points: 250,
        value: 'R$ 125,00',
        paymentMethod: 'Boleto',
        status: 'Aprovado',
        date: '10/03/2025'
      },
      {
        id: 'CR-2025-010',
        points: 300,
        value: 'R$ 150,00',
        paymentMethod: 'Cartão de Crédito',
        status: 'Aprovado',
        date: '05/03/2025'
      },
      {
        id: 'CR-2025-011',
        points: 200,
        value: 'R$ 100,00',
        paymentMethod: 'PIX',
        status: 'Aprovado',
        date: '01/03/2025'
      },
      {
        id: 'CR-2025-012',
        points: 500,
        value: 'R$ 250,00',
        paymentMethod: 'Transferência',
        status: 'Aprovado',
        date: '25/02/2025'
      }
    ]);
  }, []);

  // Filtrar créditos com base nos filtros selecionados
  const filteredCredits = creditsList.filter(credit => {
    return (
      credit.id.toLowerCase().includes(searchId.toLowerCase()) &&
      (selectedStatus === '' || credit.status === selectedStatus) &&
      (selectedPaymentMethod === '' || credit.paymentMethod === selectedPaymentMethod)
    );
  });

  // Paginação
  const paginatedCredits = filteredCredits.slice(
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

  // Função para obter o ícone de status apropriado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aprovado':
        return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '14px' }} />;
      case 'Pendente':
        return <ClockCircleOutlined style={{ color: '#faad14', fontSize: '14px' }} />;
      case 'Recusado':
        return <CloseCircleOutlined style={{ color: '#f5222d', fontSize: '14px' }} />;
      default:
        return null;
    }
  };

  // Função para obter o ícone de método de pagamento apropriado
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'Cartão de Crédito':
        return <CreditCardOutlined />;
      case 'PIX':
        return <DollarOutlined />;
      case 'Boleto':
        return <BankOutlined />;
      case 'Transferência':
        return <BankOutlined />;
      default:
        return <DollarOutlined />;
    }
  };

  // Abrir modal para adicionar créditos
  const handleAddCredits = () => {
    setIsAddCreditsModalVisible(true);
  };

  // Fechar modal de adicionar créditos
  const handleAddCreditsCancel = () => {
    setIsAddCreditsModalVisible(false);
  };

  // Processar a compra de créditos
  const handleAddCreditsSubmit = (values) => {
    // Aqui seria feita a integração com o gateway de pagamento
    console.log('Processando compra de créditos:', values);
    
    // Simulando adição de créditos ao saldo
    const newCredits = values.package.points + values.package.bonus;
    setTotalCredits(totalCredits + newCredits);
    
    // Adicionando a transação à lista
    const newTransaction = {
      id: `CR-2025-${String(creditsList.length + 1).padStart(3, '0')}`,
      points: values.package.points + values.package.bonus,
      value: `R$ ${values.package.value.toFixed(2).replace('.', ',')}`,
      paymentMethod: values.paymentMethod === 'credit_card' ? 'Cartão de Crédito' : 
                     values.paymentMethod === 'pix' ? 'PIX' : 'Transferência',
      status: 'Aprovado',
      date: dayjs().format('DD/MM/YYYY')
    };
    
    setCreditsList([newTransaction, ...creditsList]);
    message.success(`${newCredits} créditos adicionados com sucesso!`);
    setIsAddCreditsModalVisible(false);
  };

  return (
    <div className="credits-container">
      <div className="credits-header">
        <div className="credits-header-left">
          <Title level={2}>Meus Créditos</Title>
        </div>
        <div className="credits-header-right">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddCredits}
            className="add-credits-button"
          >
            Adicionar Créditos
          </Button>
        </div>
      </div>

      <div className="credits-summary">
        <div className="total-credits-card">
          <div className="total-credits-icon">
            <CrownOutlined />
          </div>
          <div className="total-credits-info">
            <div className="total-credits-label">Saldo Disponível</div>
            <div className="total-credits-value">{totalCredits} créditos</div>
          </div>
        </div>
      </div>


      <div className="credits-table">
        <Table
          dataSource={paginatedCredits}
          rowKey="id"
          pagination={false}
          className="custom-credits-table"
          columns={[
            {
              title: 'ID',
              dataIndex: 'id',
              key: 'id',
              render: (text) => (
                <div className="credit-id-cell">
                  <span className="credit-id-text">{text}</span>
                </div>
              ),
            },
            {
              title: 'Pontos',
              dataIndex: 'points',
              key: 'points',
              render: (text) => (
                <div className="credit-points-cell">
                  <CrownOutlined style={{ color: '#52c41a' }} />
                  <span className="credit-points-text">{text}</span>
                </div>
              ),
              sorter: (a, b) => a.points - b.points,
            },
            {
              title: 'Valor',
              dataIndex: 'value',
              key: 'value',
              render: (text) => (
                <div className="credit-value-cell">
                  <span className="credit-value-text">{text}</span>
                </div>
              ),
            },
            {
              title: 'Método de Pagamento',
              dataIndex: 'paymentMethod',
              key: 'paymentMethod',
              render: (text) => (
                <div className="credit-payment-cell">
                  {getPaymentMethodIcon(text)}
                  <span>{text}</span>
                </div>
              ),
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (text) => {
                let color = 'green';
                if (text === 'Pendente') color = 'gold';
                if (text === 'Recusado') color = 'red';
                
                return (
                  <Tag color={color} style={{ fontSize: 14, padding: '0 10px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    {getStatusIcon(text)}<span>{text}</span>
                  </Tag>
                );
              },
            },
            {
              title: 'Data',
              dataIndex: 'date',
              key: 'date',
              className: 'date-column',
              render: (text) => (
                <div className="credit-date-cell">
                  <span className="credit-date-text">{text}</span>
                </div>
              ),
              sorter: (a, b) => {
                const dateA = dayjs(a.date, 'DD/MM/YYYY');
                const dateB = dayjs(b.date, 'DD/MM/YYYY');
                return dateA.valueOf() - dateB.valueOf();
              },
            }
          ]}
        />
      </div>

      <div className="credits-pagination">
        <div className="pagination-info">
          Mostrando {paginatedCredits.length} de {filteredCredits.length} registros
        </div>
        <div className="pagination-controls">
          <Select
            value={pageSize}
            onChange={(value) => handlePageSizeChange(currentPage, value)}
            style={{ width: 120, marginRight: 16 }}
          >
            <Option value={5}>5 por página</Option>
            <Option value={10}>10 por página</Option>
            <Option value={20}>20 por página</Option>
          </Select>
          <div className="pagination-buttons">
            <Button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Anterior
            </Button>
            <div className="pagination-current">
              {currentPage} de {Math.ceil(filteredCredits.length / pageSize)}
            </div>
            <Button
              disabled={currentPage === Math.ceil(filteredCredits.length / pageSize)}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Próximo
            </Button>
          </div>
        </div>
      </div>

      {/* Modal para adicionar créditos */}
      <AddCreditsModal
        visible={isAddCreditsModalVisible}
        onCancel={handleAddCreditsCancel}
        onOk={handleAddCreditsSubmit}
      />
    </div>
  );
};

export default Credits;
