import React from 'react';
import useSWR from 'swr';
import { Card, Typography, Table, Spin, Result } from 'antd';
import { LoadingOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import fetch from '../../../../../lib/fetch';

const { memo } = React;
const { Text } = Typography;

const Actions = ({ start, end }) => {
  const { data } = useSWR(
    `/api/admin/analytics/actions?start=${start}&end=${end}`,
    (url) => fetch('get', url),
    { refreshInterval: 0 },
  );

  const columns = [
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Total',
      dataIndex: 'value',
      key: 'value',
      className: 'right',
      render: (value) => <Text type="secondary">{value}</Text>,
    },
  ];

  const Stats = () => {
    // Pendant le chargement de la requête
    if (!data) {
      return (
        <div style={{ width: '100%', textAlign: 'center', marginTop: 20 }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      );
    }

    // Si une erreur est survenue
    if (data.status === 'error') {
      return (
        <Result
          status="error"
          icon={<CloseCircleOutlined style={{ fontSize: 32 }} />}
          subTitle="Une erreur est survenue, veuillez réessayez"
        />
      );
    }

    // Si le tableau est vide
    if (data.data.length === 0) {
      return (
        <Result
          icon={<InfoCircleOutlined style={{ fontSize: 32 }} />}
          subTitle="Aucune donnée à afficher"
        />
      );
    }

    return (
      <Table
        dataSource={data.data}
        rowKey={(record) => record.id}
        pagination={false}
        columns={columns}
        size="small"
        showHeader={false}
        locale={{
          emptyText: 'Aucune ressource',
        }}
      />
    );
  };

  const CardTitle = () => {
    // Calcule le nombre total d'utilisateurs
    const sum =
      data && data.status !== 'error' && data.data
        ? data.data.reduce((a, b) => a + (b.value || 0), 0)
        : 0;

    if (data && data.data) {
      return (
        <>
          <Text strong>Actions</Text>
          <br />
          <Text type="secondary">
            {/* eslint-disable-next-line */}
            {sum} au total
          </Text>
        </>
      );
    }

    return <Text strong>Actions</Text>;
  };

  return (
    <Card
      bodyStyle={{ padding: 0, paddingTop: 1, height: 250 }}
      title={<CardTitle />}
      headStyle={{ fontSize: 14 }}
    >
      <Stats />
    </Card>
  );
};

export default memo(Actions);
