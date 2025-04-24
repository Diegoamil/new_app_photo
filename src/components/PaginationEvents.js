import React from 'react';
import { Pagination } from 'antd';

import { Select } from 'antd';

const PaginationEvents = ({ current, pageSize, total, onChange, onPageSizeChange }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    gap: 16
  }}>
    <div style={{ minWidth: 140 }}>
      <span style={{ marginRight: 8 }}>Eventos por página:</span>
      <Select
        value={pageSize}
        onChange={onPageSizeChange}
        style={{ width: 80 }}
      >
        <Select.Option value={6}>6</Select.Option>
        <Select.Option value={10}>10</Select.Option>
        <Select.Option value={15}>15</Select.Option>
        <Select.Option value={20}>20</Select.Option>
      </Select>
    </div>
    <Pagination
      current={current}
      pageSize={pageSize}
      total={total}
      onChange={onChange}
      showSizeChanger={false}
      showQuickJumper
      locale={{ items_per_page: 'por página', jump_to: 'Ir para', page: 'Página' }}
      style={{ flex: 1, justifyContent: 'center', display: 'flex' }}
    />
    <div style={{ minWidth: 120, textAlign: 'right' }}>
      <span>Total: <b>{total}</b></span>
    </div>
  </div>
);

export default PaginationEvents;
