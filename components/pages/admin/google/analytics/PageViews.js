import React from 'react';
import { Table, Card, Typography, Spin, Result } from 'antd';
import { LoadingOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import useSWR from 'swr';
import fetch from '../../../../../lib/fetch';

const { memo } = React;
const { Text } = Typography;

const PageViews = ({ start, end }) => {
  const { data } = useSWR(
    `/api/admin/analytics/views?start=${start}&end=${end}`,
    (url) => fetch('get', url),
    { refreshInterval: 0 },
  );

  const columns = [
    {
      title: 'Page',
      dataIndex: 'page',
      key: 'page',
      width: 200,
    },
    {
      title: 'Total de vues',
      dataIndex: 'total',
      key: 'total',
      className: 'right',
      width: 115,
      sorter: (a, b) => {
        if (a.total > b.total) return -1;
        if (a.total < b.total) return 1;
        return 0;
      },
    },
    {
      title: 'Vues uniques',
      dataIndex: 'unique',
      key: 'unique',
      className: 'right',
      width: 115,
      sorter: (a, b) => {
        if (a.unique > b.unique) return -1;
        if (a.unique < b.unique) return 1;
        return 0;
      },
    },
    {
      title: 'Temps moyen passé sur la page',
      dataIndex: 'duration',
      key: 'duration',
      className: 'right',
      width: 150,
      sorter: (a, b) => {
        if (a.duration > b.duration) return -1;
        if (a.duration < b.duration) return 1;
        return 0;
      },
    },
    {
      title: 'Entrées',
      dataIndex: 'entrances',
      key: 'entrances',
      className: 'right',
      width: 80,
      sorter: (a, b) => {
        if (a.entrances > b.entrances) return -1;
        if (a.entrances < b.entrances) return 1;
        return 0;
      },
    },
    {
      title: 'Sorties (%)',
      dataIndex: 'exitrate',
      key: 'exitrate',
      render: (value) => `${value} %`,
      className: 'right',
      width: 100,
      sorter: (a, b) => {
        if (a.exitrate > b.exitrate) return -1;
        if (a.exitrate < b.exitrate) return 1;
        return 0;
      },
    },
    {
      title: 'Taux de rebond (%)',
      dataIndex: 'bouncerate',
      key: 'bouncerate',
      render: (value) => `${value} %`,
      className: 'right',
      width: 150,
      sorter: (a, b) => {
        if (a.bouncerate > b.bouncerate) return -1;
        if (a.bouncerate < b.bouncerate) return 1;
        return 0;
      },
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
        bordered
        dataSource={data.data}
        rowKey={(record) => record.id}
        pagination={false}
        columns={columns}
        loading={!data}
        size="small"
        scroll={{ x: 600 }}
        locale={{
          cancelSort: 'Annuler le tri',
          triggerAsc: 'Trier par ordre croissant',
          triggerDesc: 'Trier par ordre décroissant',
          emptyText: 'Aucune donnée',
          filterReset: 'Réinitialiser',
        }}
      />
    );
  };

  const CardTitle = () => {
    // Calcule le nombre total d'utilisateurs
    const sum = data && data.status !== 'error' && data.data ? data.data.length : 0;

    if (data && data.data) {
      return (
        <>
          <Text strong>Pages</Text>
          <br />
          <Text type="secondary">
            {/* eslint-disable-next-line */}
            {sum} au total
          </Text>
        </>
      );
    }

    return <Text strong>Pages</Text>;
  };

  return (
    <Card
      bodyStyle={{ padding: 0, minHeight: 250 }}
      title={<CardTitle />}
      headStyle={{ fontSize: 14 }}
    >
      <Stats />
    </Card>
  );
};

export default memo(PageViews);
