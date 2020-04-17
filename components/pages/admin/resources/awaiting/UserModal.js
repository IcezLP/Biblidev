import React, { useState } from 'react';
import { Modal, Spin, Col, Row, Typography } from 'antd';
import useSWR from 'swr';
import { LoadingOutlined } from '@ant-design/icons';
import fetch from '../../../../../lib/fetch';

export default ({ username, id }) => {
  const [visible, setVisible] = useState(false);

  const { data } = useSWR(visible ? `/api/users/${id}` : null, (url) => fetch('get', url));

  const Profile = () => {
    if (!data) {
      return (
        <Row style={{ margin: '20px 0' }} type="flex" justify="center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </Row>
      );
    }

    if (data.status === 'error') {
      return (
        <Row style={{ margin: '20px 0' }} type="flex" justify="center">
          <Typography.Paragraph>Une erreur est survenue, veuillez réesayer</Typography.Paragraph>
        </Row>
      );
    }

    if (Object.keys(data.data).length === 0) {
      return (
        <Row style={{ margin: '20px 0' }} type="flex" justify="center">
          <Typography.Paragraph>Aucun utilisateur n'a été trouvé</Typography.Paragraph>
        </Row>
      );
    }

    if (data.data) {
      return data.data.username;
    }
  };

  return (
    <>
      <span className="resource__author" onClick={() => setVisible(true)}>
        {/* eslint-disable-next-line */}
        <b>{username}</b> ({id})
      </span>
      <Modal key={`user-${id}`} visible={visible} footer={null} onCancel={() => setVisible(false)}>
        <Profile />
      </Modal>
    </>
  );
};
