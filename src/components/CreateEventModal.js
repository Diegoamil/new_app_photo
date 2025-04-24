import React, { useState } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  TimePicker, 
  Select, 
  Checkbox,
  Button, 
  Typography, 
  Divider, 
  Row, 
  Col, 
  Upload, 
  message,
  Switch,
  InputNumber
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './CreateEventModal.css';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreateEventModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      // Formatando a data para o formato DD/MM
      const formattedDate = values.date ? values.date.format('DD/MM') : '';
      // Formatando a hora para o formato HH:mm
      const formattedTime = values.time ? values.time.format('HH:mm') : '';

      const eventData = {
        ...values,
        date: formattedDate,
        time: formattedTime,
        coverImage: fileList.length > 0 ? fileList[0] : null
      };

      onSubmit(eventData);
      form.resetFields();
      setShowAdditionalFields(false);
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setShowAdditionalFields(false);
    setFileList([]);
    onCancel();
  };

  const toggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Você só pode fazer upload de arquivos JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('A imagem deve ser menor que 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const eventTypes = [
    { value: 'casamento', label: 'Casamento' },
    { value: 'aniversario', label: 'Aniversário' },
    { value: 'corporativo', label: 'Corporativo' },
    { value: 'formatura', label: 'Formatura' },
    { value: 'outro', label: 'Outro' }
  ];

  return (
    <Modal
      title={
        <div className="modal-title">
          <Title level={4}>Criar Novo Evento</Title>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      className="create-event-modal"
      width={800}
      style={{ top: 20 }}
      styles={{ 
        body: { padding: 0 },
        footer: { borderTop: 'none', backgroundColor: '#f5f5f5', padding: '16px 24px' },
        content: { backgroundColor: '#fff' }
      }}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} className="submit-button">
          Criar Evento
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        className="event-form"
        initialValues={{
          type: 'Treinos',
          date: dayjs(),
          time: dayjs('17:30', 'HH:mm'),
          hasPhotos: false,
          hasVideos: false,
          officialPercentage: 90,
          minResolution: '3450x2300',
          identificationMethod: 'Detecção Facial',
          points: 10,
          photographers: 3
        }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Título do Evento"
              rules={[{ required: true, message: 'Por favor, insira o título do evento' }]}
            >
              <Input placeholder="Ex: TREINOS LITORÂNEA 23/04" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="type"
              label="Tipo de Evento"
              rules={[{ required: true, message: 'Por favor, selecione o tipo de evento' }]}
            >
              <Select>
                <Option value="Treinos">Treinos</Option>
                <Option value="Corrida de Rua">Corrida de Rua</Option>
                <Option value="Competição">Competição</Option>
                <Option value="Workshop">Workshop</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="location"
              label="Local"
              rules={[{ required: true, message: 'Por favor, insira o local do evento' }]}
            >
              <Input 
                placeholder="Ex: São Luís / MA" 
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="date"
              label="Data"
              rules={[{ required: true, message: 'Por favor, selecione a data' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="time"
              label="Horário"
              rules={[{ required: true, message: 'Por favor, selecione o horário' }]}
            >
              <TimePicker 
                style={{ width: '100%' }} 
                format="HH:mm"
                placeholder="Selecione o horário"
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Comissões e Requisitos</Divider>

        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="officialPercentage"
              label="Percentual Oficial do Fotógrafo"
              rules={[{ required: true, message: 'Por favor, insira o percentual' }]}
            >
              <InputNumber 
                min={0} 
                max={100} 
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="minResolution"
              label="Resolução Mínima de Upload"
              rules={[{ required: true, message: 'Por favor, insira a resolução mínima' }]}
            >
              <Input placeholder="Ex: 3450x2300" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="identificationMethod"
              label="Identificação dos Atletas"
              rules={[{ required: true, message: 'Por favor, selecione o método de identificação' }]}
            >
              <Select>
                <Option value="Detecção Facial">Somente por Detecção Facial</Option>
                <Option value="Número de Peito">Número de Peito</Option>
                <Option value="Manual">Identificação Manual</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="points"
              label="Pontos"
              rules={[{ required: true, message: 'Por favor, insira os pontos' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="photographers"
              label="Número de Fotógrafos"
              rules={[{ required: true, message: 'Por favor, insira o número de fotógrafos' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Mídia e Preços</Divider>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Imagem de Capa do Evento"
              name="coverImage"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra="Arraste e solte uma imagem ou clique para fazer upload"
            >
              <Upload.Dragger 
                name="files" 
                beforeUpload={beforeUpload}
                onChange={handleChange}
                fileList={fileList}
                maxCount={1}
                listType="picture"
                accept="image/png, image/jpeg"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Clique ou arraste uma imagem para esta área</p>
                <p className="ant-upload-hint">
                  Suporte para uma única imagem. Tamanho máximo: 2MB.
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="hasPhotos"
              label="Disponibilizar Fotos"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="hasVideos"
              label="Disponibilizar Vídeos"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Preços de Venda</Divider>

        <Row gutter={24}>
          <Col xs={24} sm={8}>
            <Form.Item
              name="priceVideo"
              label="Preço do Vídeo (R$)"
            >
              <InputNumber 
                min={0} 
                step={0.1} 
                precision={2}
                style={{ width: '100%' }}

              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              name="priceHigh"
              label="Preço Alta Resolução (R$)"
            >
              <InputNumber 
                min={0} 
                step={0.1} 
                precision={2}
                style={{ width: '100%' }}

              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              name="priceLow"
              label="Preço Baixa Resolução (R$)"
            >
              <InputNumber 
                min={0} 
                step={0.1} 
                precision={2}
                style={{ width: '100%' }}

              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Pacotes</Divider>

        <Row gutter={24}>
          <Col xs={24} sm={8}>
            <Form.Item
              name="package5percent"
              label="Pacote 5% (qtd. fotos)"
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              name="package10percent"
              label="Pacote 10% (qtd. fotos)"
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              name="package20percent"
              label="Pacote 20% (qtd. fotos)"
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Informações Adicionais</Divider>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Descrição do Evento"
            >
              <TextArea rows={4} placeholder="Descreva detalhes adicionais sobre o evento..." />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateEventModal;
