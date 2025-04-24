import React, { useState, useEffect } from 'react';
import { Typography, Input, Select, Row, Col, Table, Button, DatePicker, Tag, Space, Tooltip, message } from 'antd';
import CreateEventModal from './CreateEventModal';
import ViewEventModal from './ViewEventModal';
import PaginationEvents from './PaginationEvents';
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  PictureOutlined, 
  VideoCameraOutlined,
  ThunderboltOutlined,
  FilterOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import './Events.css';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const Events = () => {
  const [searchName, setSearchName] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs('2025-04-23'));
  const [selectedState, setSelectedState] = useState('Maranhão');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' ou 'grid'
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsList, setEventsList] = useState([]);
  
  // Set events list on component mount
  useEffect(() => {
    // Initialize with sample data
    setEventsList([
      {
        id: 1,
        title: 'TREINOS LITORÂNEA 23/04',
        type: 'Treinos',
        date: '23.04-17:30h',
        location: 'São Luís / Maranhão',
        hasPhotos: true,
        hasVideos: true
      },
      {
        id: 2,
        title: 'TREINOS LITORÂNEA 24/04',
        type: 'Treinos',
        date: '24.04-17:30h',
        location: 'São Luís / Maranhão',
        hasPhotos: true,
        hasVideos: true
      },
      {
        id: 3,
        title: 'TREINOS LITORÂNEA 25/04',
        type: 'Treinos',
        date: '25.04-17:30h',
        location: 'São Luís / Maranhão',
        hasPhotos: true,
        hasVideos: true
      },
      {
        id: 4,
        title: 'TREINOS SÁBADO LITORÂNEA 26/04',
        type: 'Treinos',
        date: '26.04-08:00h',
        location: 'São Luís / Maranhão',
        hasPhotos: true,
        hasVideos: true
      },
      {
        id: 5,
        title: 'CORRIDA CONSCIENTIZAÇÃO DO AUTISMO',
        type: 'Corrida de Rua',
        date: '26.04-16:00h',
        location: 'Poção de Pedras / Maranhão',
        hasPhotos: true,
        hasVideos: true
      },
      {
        id: 6,
        title: 'CORRIDA DE RUA PEDREIRAS',
        type: 'Corrida de Rua',
        date: '27.04-06:30h',
        location: 'Pedreiras / Maranhão',
        hasPhotos: true,
        hasVideos: true
      },
      // Eventos adicionais para paginação
      {
        id: 7,
        title: 'CORRIDA DA INTEGRAÇÃO',
        type: 'Corrida de Rua',
        date: '28.04-07:00h',
        location: 'Imperatriz / Maranhão',
        hasPhotos: true,
        hasVideos: false
      },
      {
        id: 8,
        title: 'CAMINHADA SAÚDE E VIDA',
        type: 'Caminhada',
        date: '29.04-08:30h',
        location: 'Bacabal / Maranhão',
        hasPhotos: false,
        hasVideos: true
      },
      {
        id: 9,
        title: 'DESAFIO CICLÍSTICO',
        type: 'Ciclismo',
        date: '30.04-09:00h',
        location: 'Caxias / Maranhão',
        hasPhotos: true,
        hasVideos: true
      },
      {
        id: 10,
        title: 'MARATONA DA AMAZÔNIA',
        type: 'Corrida de Rua',
        date: '01.05-06:00h',
        location: 'Belém / Pará',
        hasPhotos: true,
        hasVideos: true
      },
      {
        id: 11,
        title: 'CORRIDA SOLIDÁRIA',
        type: 'Corrida de Rua',
        date: '02.05-07:30h',
        location: 'Teresina / Piauí',
        hasPhotos: false,
        hasVideos: true
      },
      {
        id: 12,
        title: 'CAMINHADA DA FAMÍLIA',
        type: 'Caminhada',
        date: '03.05-08:00h',
        location: 'Parnaíba / Piauí',
        hasPhotos: true,
        hasVideos: false
      },
      {
        id: 13,
        title: 'DESAFIO DE MONTANHA',
        type: 'Ciclismo',
        date: '04.05-09:00h',
        location: 'Chapada das Mesas / Maranhão',
        hasPhotos: true,
        hasVideos: true
      },
      {
        id: 14,
        title: 'CORRIDA DAS CORES',
        type: 'Corrida de Rua',
        date: '05.05-07:00h',
        location: 'São Luís / Maranhão',
        hasPhotos: true,
        hasVideos: false
      },
      {
        id: 15,
        title: 'CAMINHADA DA PAZ',
        type: 'Caminhada',
        date: '06.05-08:00h',
        location: 'Balsas / Maranhão',
        hasPhotos: false,
        hasVideos: true
      }
    ]);
  }, []);
  
  // Set current date on component mount
  useEffect(() => {
    // Formatar a data atual para comparar com as datas dos eventos
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}`;
    setCurrentDate(formattedDate);
    
    // Atualizar a data atual à meia-noite para manter o destaque dos eventos do dia atualizado
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow.getTime() - today.getTime();
    
    const midnightTimer = setTimeout(() => {
      const newToday = new Date();
      const newFormattedDate = `${String(newToday.getDate()).padStart(2, '0')}.${String(newToday.getMonth() + 1).padStart(2, '0')}`;
      setCurrentDate(newFormattedDate);
    }, timeUntilMidnight);
    
    return () => clearTimeout(midnightTimer);
  }, []);
  
  // Handle create modal visibility
  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
  };
  
  // Handle view modal visibility
  const showViewModal = (event) => {
    setSelectedEvent(event);
    setIsViewModalVisible(true);
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
  };

  const handleCreateEvent = (eventData) => {
    // Create a new event object
    const newEvent = {
      id: eventsList.length + 1,
      title: eventData.title,
      type: eventData.type,
      date: `${eventData.date.split('/')[0]}.${eventData.date.split('/')[1]}-${eventData.time}h`,
      location: eventData.location,
      hasPhotos: eventData.hasPhotos,
      hasVideos: eventData.hasVideos
    };
    
    // Add the new event to the list
    setEventsList([...eventsList, newEvent]);
    setIsCreateModalVisible(false);
    message.success('Evento criado com sucesso!');
  };

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Filter events based on search criteria
  const filteredEvents = eventsList.filter(event => {
    const matchesName = event.title.toLowerCase().includes(searchName.toLowerCase());
    const matchesCategory = selectedCategory ? event.type === selectedCategory : true;
    return matchesName && matchesCategory;
  });

  // Eventos para a página atual (apenas para visualização em tabela)
  const paginatedEvents = viewMode === 'table' 
    ? filteredEvents.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredEvents; // No modo grid, mostramos todos os eventos filtrados

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };
  
  // Function to get the appropriate icon for event type
  const getEventTypeIcon = (type) => {
    if (type === 'Treinos') return <CalendarOutlined />;
    if (type === 'Corrida de Rua') return <ThunderboltOutlined />;
    return <CalendarOutlined />;
  };
  
  return (
    <div className="events-container">
      <div className="events-header">
        <div className="events-header-left">
          <Title level={2}>Eventos</Title>
        </div>
        <div className="events-header-right">
          <div className="view-mode-buttons">
            <Button
              type={viewMode === 'table' ? "primary" : "default"}
              icon={<UnorderedListOutlined />}
              onClick={() => setViewMode('table')}
              className="view-mode-button"
            />
            <Button
              type={viewMode === 'grid' ? "primary" : "default"}
              icon={<AppstoreOutlined />}
              onClick={() => setViewMode('grid')}
              className="view-mode-button"
            />
          </div>
          <Button 
            type={showFilters ? "primary" : "default"}
            icon={<FilterOutlined />} 
            onClick={() => setShowFilters(!showFilters)}
            className="filter-button"
          >
            Filtros
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            className="create-event-button"
            onClick={showCreateModal}
          >
            Criar Evento
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <div className="events-filters">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6} lg={6} xl={6}>
              <div className="filter-label">Nome</div>
              <Input 
                placeholder="Filtrar por Nome" 
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={6} lg={6} xl={6}>
              <div className="filter-label">Data</div>
              <DatePicker 
                value={selectedDate}
                onChange={value => setSelectedDate(value)}
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
                placeholder="Selecionar data"
              />
            </Col>
            <Col xs={24} sm={12} md={6} lg={6} xl={6}>
              <div className="filter-label">Estado</div>
              <Select 
                value={selectedState}
                onChange={value => setSelectedState(value)}
                style={{ width: '100%' }}
              >
                <Option value="Maranhão">Maranhão</Option>
                <Option value="Piauí">Piauí</Option>
                <Option value="Ceará">Ceará</Option>
                <Option value="Pará">Pará</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6} lg={6} xl={6}>
              <div className="filter-label">Categoria</div>
              <Select
                value={selectedCategory}
                onChange={value => setSelectedCategory(value)}
                allowClear
                style={{ width: '100%' }}
                placeholder="Todas"
              >
                <Option value="Corrida de Rua">Corrida de Rua</Option>
                <Option value="Treinos">Treinos</Option>
                <Option value="Caminhada">Caminhada</Option>
                <Option value="Ciclismo">Ciclismo</Option>
              </Select>
            </Col>
          </Row>
        </div>
      )}
      
      {viewMode === 'table' ? (
        <div className="events-table">
          <Table 
            dataSource={paginatedEvents} 
            rowKey="id"
            pagination={false}
            className="custom-events-table"
            columns={[
            {
              title: 'Data',
              dataIndex: 'date',
              key: 'date',
              render: (text) => {
                // Check if the date is today
                const isToday = text.startsWith(currentDate);
                const timeString = text.split('-')[1];
                
                return (
                  <div className="event-date-cell">
                    <CalendarOutlined style={{ marginRight: '8px', color: '#000' }} />
                    <span className={`event-date-text ${isToday ? 'today' : ''}`}>
                      {isToday ? `Hoje-${timeString}` : text}
                    </span>
                  </div>
                );
              },
              sorter: (a, b) => new Date(a.date) - new Date(b.date),
              defaultSortOrder: 'ascend',
              className: 'date-column',
            },
            {
              title: 'Evento',
              dataIndex: 'title',
              key: 'title',
              render: (text) => (
                <div className="event-title-cell">
                  <div className="event-title-text">{text}</div>
                </div>
              ),
            },
            {
              title: 'Local',
              dataIndex: 'location',
              key: 'location',
              render: (text) => (
                <div className="event-location-cell">
                  <EnvironmentOutlined style={{ marginRight: '8px' }} />
                  {text}
                </div>
              ),
            },
            {
              title: 'Categoria',
              key: 'categoria',
              render: (_, record) => (
                <Tag color={record.type === 'Corrida de Rua' ? 'volcano' : 'blue'} style={{ fontSize: 14, minWidth: 0, width: 'auto', display: 'inline-block', padding: '2px 8px', textAlign: 'center' }}>
                  {record.type}
                </Tag>
              ),
            },
            {
              title: 'Ações',
              key: 'actions',
              render: (_, record) => (
                <Button 
                  type="primary" 
                  size="small"
                  onClick={() => showViewModal(record)}
                >
                  Ver Evento
                </Button>
              ),
            },
          ]}
          />
        </div>
      ) : (
        <div className="events-grid">
          <Row gutter={[16, 16]}>
            {paginatedEvents.map(event => (
              <Col xs={24} sm={12} md={8} lg={6} key={event.id}>
                <div className={`event-card ${currentDate && event.date.startsWith(currentDate) ? 'today-event' : ''}`}>
                  <div className="event-card-header">
                    <div className="event-card-date">
                      <CalendarOutlined style={{ marginRight: '8px' }} />
                      <span className={currentDate && event.date.startsWith(currentDate) ? 'today' : ''}>
                        {currentDate && event.date.startsWith(currentDate) ? `Hoje-${event.date.split('-')[1]}` : event.date}
                      </span>
                    </div>
                    <Tag color={event.type === 'Corrida de Rua' ? 'volcano' : 'blue'} 
                      style={{ fontSize: 14, minWidth: 0, width: 'auto', display: 'inline-block', padding: '2px 8px', textAlign: 'center' }}>
                      {event.type}
                    </Tag>
                  </div>
                  <div className="event-card-title">{event.title}</div>
                  <div className="event-card-location">
                    <EnvironmentOutlined style={{ marginRight: '8px' }} />
                    {event.location}
                  </div>
                  <div className="event-card-media">
                    {event.hasPhotos && (
                      <Tag color="green">
                        <PictureOutlined /> Fotos
                      </Tag>
                    )}
                    {event.hasVideos && (
                      <Tag color="purple">
                        <VideoCameraOutlined /> Vídeos
                      </Tag>
                    )}
                  </div>
                  <Button 
                    type="primary" 
                    block
                    onClick={() => showViewModal(event)}
                    className="event-card-button"
                  >
                    Ver Evento
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}
      {/* Paginação - apenas visível no modo tabela */}
      {viewMode === 'table' && (
        <PaginationEvents
          current={currentPage}
          pageSize={pageSize}
          total={filteredEvents.length}
          onChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Modal de Criação de Evento */}
      <CreateEventModal 
        visible={isCreateModalVisible} 
        onCancel={handleCreateCancel} 
        onOk={handleCreateEvent} 
      />
      
      {/* Modal de Visualização de Evento */}
      <ViewEventModal 
        visible={isViewModalVisible} 
        onCancel={handleViewCancel} 
        event={selectedEvent} 
      />
    </div>
  );
};

export default Events;
