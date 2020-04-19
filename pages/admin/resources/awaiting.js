import React from 'react';
import useSWR from 'swr';
import { Col, Row, Spin, Result, Modal } from 'antd';
import { LoadingOutlined, SmileOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import withAuth from '../../../middlewares/withAuth';
import Layout from '../../../components/layout/admin/Layout';
import Card from '../../../components/pages/admin/resources/awaiting/Card';
import fetch from '../../../lib/fetch';
import { notify } from '../../../lib/notification';

export default withAuth(
  () => {
    const { data, mutate } = useSWR('/api/admin/resources?state=awaiting&sort=oldest', (url) =>
      fetch('get', url),
    );

    const verifyConfirm = (name, id) => {
      const confirm = Modal.confirm({
        title: `Êtes-vous sûr de vouloir valider cette ressource ? ${name} (${id})`,
        content:
          'Assurez-vous de bien avoir vérifier la ressource (orthographe, lien, catégories...)',
        okText: 'Confirmer',
        cancelText: 'Annuler',
        onOk: (event) => {
          confirm.update({
            okButtonProps: {
              loading: true,
            },
            cancelButtonProps: {
              disabled: true,
            },
          });

          const acceptResource = async () => {
            const response = await fetch('post', `/api/admin/resources/accept/${id}`);

            notify(response.status, response.message);

            confirm.update({
              okButtonProps: {
                loading: false,
              },
              cancelButtonProps: {
                disabled: false,
              },
            });
            mutate();
            confirm.destroy();
          };

          acceptResource();
        },
        icon: <QuestionCircleOutlined />,
      });
    };

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
        return <Result icon={<SmileOutlined />} title="Aucune ressource à valider" />;
      }

      return (
        <Row gutter={[12, 12]} type="flex">
          {data.data.resources.map((item) => (
            <Col xs={24} key={item._id}>
              <Card resource={item} onCheck={verifyConfirm} />
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
