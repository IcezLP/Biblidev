import React from 'react';
import { Row, Col } from 'antd';
import Input from '../../form/Input';

export default React.memo(({ query, onSearch, onChange }) => (
  <Row gutter={[12, 12]} type="flex">
    <Col xs={24}>
      <Input
        name="search"
        search
        value={query}
        onChange={onChange}
        onSearch={onSearch}
        placeholder="Rechercher..."
      />
    </Col>
  </Row>
));
