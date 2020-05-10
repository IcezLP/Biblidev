import React from 'react';
import { Card, Spin, Result, Statistic, Typography } from 'antd';
import {
  LoadingOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import useSWR from 'swr';
import moment from 'moment';
import fetch from '../../../../lib/fetch';

const { memo } = React;
const { Text } = Typography;

const Total = ({ title, model }) => {
  const { data } = useSWR(`/api/admin/dashboard/total/${model}`, (url) => fetch('get', url), {
    refreshInterval: 0,
  });

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
          style={{ padding: 0 }}
          status="error"
          icon={<CloseCircleOutlined style={{ fontSize: 32 }} />}
          subTitle="Une erreur est survenue, veuillez réessayez"
        />
      );
    }

    // Si le tableau est vide
    if (!data.data) {
      return (
        <Result
          style={{ padding: 0 }}
          icon={<InfoCircleOutlined style={{ fontSize: 32 }} />}
          subTitle="Aucune donnée à afficher"
        />
      );
    }

    const firstDayOfMonth = moment().startOf('month');
    const news = data.data.filter((record) => moment(record.createdAt).isAfter(firstDayOfMonth));

    return (
      <Statistic
        title={
          <>
            <Text strong>{title}</Text>
            <br />
            <Text type="secondary">{data.data.length}</Text>
          </>
        }
        value={news.length}
        valueStyle={{ color: '#3f8600', fontSize: 16 }}
        prefix={<PlusOutlined style={{ fontSize: 14 }} />}
        suffix="ce mois-ci"
      />
    );
  };

  return (
    <Card style={{ textAlign: 'center' }}>
      <Stats />
    </Card>
  );
};

export default memo(Total);
