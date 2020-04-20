import React, { useState } from 'react';
import { Modal, Spin, Col, Row, Typography, Avatar, List, Collapse } from 'antd';
import useSWR from 'swr';
import {
  LoadingOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import Moment from 'react-moment';
import fetch from '../../../../lib/fetch';

export default ({ username, id }) => {
  const [visible, setVisible] = useState(false);

  const Shared = () => {
    const { data } = useSWR(visible ? `/api/admin/resources/shared/${id}` : null, (url) =>
      fetch('get', url),
    );

    if (!data) {
      return (
        <div style={{ textAlign: 'center', margin: '1em 0' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      );
    }

    if (data.status === 'error') {
      return (
        <Typography.Paragraph style={{ textAlign: 'center', marginTop: '1em' }}>
          Une erreur est survenue, veuillez réessayez
        </Typography.Paragraph>
      );
    }

    if (!data.data.resources || data.data.resources.length === 0) {
      return (
        <Typography.Paragraph style={{ textAlign: 'center', marginTop: '1em' }}>
          Cet utilisateur n'a partagé aucune ressource favorite
        </Typography.Paragraph>
      );
    }

    if (data.data.resources) {
      return (
        <List
          size="small"
          dataSource={data.data.resources}
          renderItem={(resource) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <>
                    {resource.name}
                    <Typography.Text type="secondary">
                      {resource.state === 'Validée' ? (
                        <>
                          <CheckCircleOutlined style={{ color: '#54c51d', margin: '0 5px' }} />
                          Validée
                        </>
                      ) : (
                        <>
                          <ClockCircleOutlined style={{ color: '#faad14', margin: '0 5px' }} />
                          En attente de validation
                        </>
                      )}
                    </Typography.Text>
                  </>
                }
                avatar={
                  resource.logo ? (
                    <Avatar src={resource.logo} />
                  ) : (
                    <Avatar
                      style={{
                        backgroundColor: 'red',
                      }}
                    >
                      {resource.name.charAt(0)}
                    </Avatar>
                  )
                }
                description={
                  <>
                    Posté le&nbsp;
                    <Moment locale="fr" format="DD MMMM YYYY">
                      {resource.createdAt}
                    </Moment>
                  </>
                }
              />
            </List.Item>
          )}
        />
      );
    }
  };

  const Favorites = () => {
    const { data } = useSWR(visible ? `/api/admin/resources/favorites/${id}` : null, (url) =>
      fetch('get', url),
    );

    if (!data) {
      return (
        <div style={{ textAlign: 'center', margin: '1em 0' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      );
    }

    if (data.status === 'error') {
      return (
        <Typography.Paragraph style={{ textAlign: 'center', marginTop: '1em' }}>
          Une erreur est survenue, veuillez réessayez
        </Typography.Paragraph>
      );
    }

    if (!data.data.resources || data.data.resources.length === 0) {
      return (
        <Typography.Paragraph style={{ textAlign: 'center', marginTop: '1em' }}>
          Cet utilisateur n'a aucune ressource favorite
        </Typography.Paragraph>
      );
    }

    if (data.data.resources) {
      return (
        <List
          size="small"
          dataSource={data.data.resources}
          renderItem={(resource) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <>
                    {resource.name}
                    <Typography.Text type="secondary">
                      {resource.state === 'Validée' ? (
                        <>
                          <CheckCircleOutlined style={{ color: '#54c51d', margin: '0 5px' }} />
                          Validée
                        </>
                      ) : (
                        <>
                          <ClockCircleOutlined style={{ color: '#faad14', margin: '0 5px' }} />
                          En attente de validation
                        </>
                      )}
                    </Typography.Text>
                  </>
                }
                avatar={
                  resource.logo ? (
                    <Avatar src={resource.logo} />
                  ) : (
                    <Avatar
                      style={{
                        backgroundColor: 'red',
                      }}
                    >
                      {resource.name.charAt(0)}
                    </Avatar>
                  )
                }
                description={
                  <>
                    Posté par&nbsp;
                    {resource.author ? (
                      <span style={{ color: '#1890ff' }}>
                        {/* eslint-disable-next-line */}
                        <b style={{ fontWeight: 'bold' }}>{resource.author.username}</b>
                        &nbsp;
                        {`(${resource.author._id})`}
                      </span>
                    ) : (
                      'Anonyme'
                    )}
                  </>
                }
              />
            </List.Item>
          )}
        />
      );
    }
  };

  const Profile = () => {
    const { data } = useSWR(visible ? `/api/admin/users/${id}` : null, (url) => fetch('get', url));

    if (!data) {
      return (
        <div className="center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      );
    }

    if (data.status === 'error' || !data.data.user) {
      return (
        <div className="center">
          <Typography.Paragraph>Une erreur est survenue, veuillez réessayez</Typography.Paragraph>
        </div>
      );
    }

    if (Object.keys(data.data.user).length === 0) {
      return (
        <div className="center">
          <Typography.Paragraph>Aucun utilisateur n'a été trouvé</Typography.Paragraph>
        </div>
      );
    }

    if (data.data.user) {
      return (
        <>
          <div className="user__header">
            <Typography.Text type="secondary" style={{ display: 'block', marginBottom: '0.5em' }}>
              {data.data.user._id}
            </Typography.Text>
            {data.data.user.avatar ? (
              <Avatar size={64} src={data.data.user.avatar} />
            ) : (
              <Avatar
                size={64}
                style={{
                  backgroundColor: 'red',
                }}
              >
                {data.data.user.username.charAt(0)}
              </Avatar>
            )}
            <br />
            <Typography.Title level={4}>{data.data.user.username}</Typography.Title>
          </div>
          <Typography.Text type="secondary">
            Inscrit depuis le&nbsp;
            <Moment locale="fr" format="DD MMMM YYYY">
              {data.data.user.createdAt}
            </Moment>
            <br />
          </Typography.Text>
          <Typography.Text type="secondary">
            {data.data.user.isAdmin ? (
              <CheckCircleOutlined style={{ color: '#54c51d', marginRight: '5px' }} />
            ) : (
              <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: '5px' }} />
            )}
            Administrateur
          </Typography.Text>
          <br />
          <Typography.Text type="secondary">
            {data.data.user.verified ? (
              <CheckCircleOutlined style={{ color: '#54c51d', marginRight: '5px' }} />
            ) : (
              <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: '5px' }} />
            )}
            Adresse mail vérifiée
          </Typography.Text>
          <br />
          <Typography.Text type="secondary">
            {data.data.user.newsletter ? (
              <CheckCircleOutlined style={{ color: '#54c51d', marginRight: '5px' }} />
            ) : (
              <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: '5px' }} />
            )}
            Inscrit à la newsletter
          </Typography.Text>
          <br />
          <Typography.Text type="secondary">
            {data.data.user.notifications ? (
              <CheckCircleOutlined style={{ color: '#54c51d', marginRight: '5px' }} />
            ) : (
              <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: '5px' }} />
            )}
            Notifications activées
          </Typography.Text>
        </>
      );
    }
  };

  return (
    <>
      <span
        onClick={() => setVisible(true)}
        style={{ fontWeight: 'bold', color: '#1890ff', cursor: 'pointer' }}
      >
        {username}
      </span>
      <Modal
        key={`user-${id}`}
        visible={visible}
        footer={null}
        onCancel={() => setVisible(false)}
        className="user__profile-modal"
        width={750}
      >
        <Row gutter={[0, 12]} style={{ margin: '20px 0' }} type="flex" justify="center">
          <Col xs={24} md={8}>
            <Profile />
          </Col>
          <Col xs={24} md={16}>
            <Collapse defaultActiveKey={['shared']} accordion>
              <Collapse.Panel header="Ressources partagées" key="shared">
                <Shared />
              </Collapse.Panel>
              <Collapse.Panel header="Ressources favorites" key="favorites">
                <Favorites />
              </Collapse.Panel>
            </Collapse>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
