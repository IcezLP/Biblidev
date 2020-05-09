import React from 'react';
import { Table } from 'antd';
import useSWR from 'swr';
import fetch from '../../../../../lib/fetch';

const { memo } = React;

const PageViews = ({ start, end }) => {
  const { data } = useSWR(
    `/api/admin/analytics/views?start=${start}&end=${end}`,
    (url) => fetch('get', url),
    { refreshInterval: 0 },
  );

  const dataSource = () => {
    if (!data || (data && data.status === 'error')) {
      return [];
    }

    return data.data;
  };

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

  return (
    <Table
      bordered
      dataSource={dataSource()}
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

export default memo(PageViews);
