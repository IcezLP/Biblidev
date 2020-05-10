import React from 'react';
import { Row, Col } from 'antd';
import withAuth from '../../middlewares/withAuth';
import Layout from '../../components/layout/admin/Layout';
import Total from '../../components/pages/admin/dashboard/Total';
import Server from '../../components/pages/admin/dashboard/Server';

export default withAuth(
  () => (
    <Layout>
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={12}>
          <Total title="Utilisateurs" model="users" />
        </Col>
        <Col xs={24} sm={12}>
          <Total title="Ressources" model="resources" />
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <Server />
        </Col>
      </Row>
    </Layout>
  ),
  { loginRequired: true, adminRequired: true },
);
