import React from 'react';
import useSWR from 'swr';
import { Col, Row, Spin, Result } from 'antd';
import { LoadingOutlined, FrownOutlined } from '@ant-design/icons';
import withAuth from '../../../middlewares/withAuth';
import Layout from '../../../components/layout/admin/Layout';
import Card from '../../../components/pages/admin/resources/awaiting/Card';

export default withAuth(
  () => {
    const { data } = useSWR('/api/resources/awaiting', (url) => fetch('get', url));

    const Resources = () => {
      if (!data) {
        return (
          <Row style={{ margin: '20px 0' }} type="flex" justify="center">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </Row>
        );
      }

      if (data.status === 'error' || !data.data.resources) {
        return <Result status="error" title="Une erreur est survenue, veuillez réesayer" />;
      }

      if (data.data.resources.length === 0) {
        return <Result icon={<FrownOutlined />} title="Aucun résultat" />;
      }

      return (
        <Row gutter={[12, 12]} type="flex">
          {data.data.resources.map((item) => (
            <Col xs={24} key={item._id}>
              <Card resource={item} />
            </Col>
          ))}
        </Row>
      );
    };

    const subTitle = () => {
      if (!data) {
        return 'Chargement des ressources...';
      }

      if (data.status === 'error' || !data.data.resources) {
        return '';
      }

      if (data.data.resources.length === 0) {
        return 'Aucune ressource à valider';
      }

      return `${data.data.resources.length} ressource${
        data.data.resources.length > 1 ? 's' : ''
      } à valider`;
    };

    return (
      <Layout title="Ressources en attente de validation" subTitle={subTitle()}>
        <div id="awaiting">
          <Resources />
        </div>
      </Layout>
    );
  },
  { loginRequired: true, adminRequired: true },
);
