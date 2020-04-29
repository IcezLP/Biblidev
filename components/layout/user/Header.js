import React from 'react';
import { Card, Avatar, Row, Col } from 'antd';

export default ({ user }) => (
  <Card style={{ backgroundColor: '#f0f2f5' }}>
    <Row>
      <Col xs={24} sm={4}>
        {user.avatar ? (
          <Avatar size={96} src={user.avatar} />
        ) : (
          <Avatar size={96}>{user.username.charAt(0).toUpperCase()}</Avatar>
        )}
      </Col>
    </Row>
  </Card>
);
