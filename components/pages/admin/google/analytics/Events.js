import React from 'react';
import useSWR from 'swr';
import { Card, Spin, Result, Typography } from 'antd';
import { LoadingOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Chart, Line, Point } from 'bizcharts';
import fetch from '../../../../../lib/fetch';

const { memo } = React;
const { Text } = Typography;

const Devices = ({ start, end }) => {
  const { data } = useSWR(
    `/api/admin/analytics/totalevents?start=${start}&end=${end}`,
    (url) => fetch('get', url),
    { refreshInterval: 0 },
  );

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
      <Chart padding={[30, 40, 50, 40]} autoFit height="100%" data={data.data} pixelRatio={3}>
        <Line shape="line" size={1} color="#6395fa" position="Date*Total" />
        <Point position="Date*Total" color="#6395fa" />
        <Line shape="line" size={1} color="#62daab" position="Date*Unique" />
        <Point position="Date*Unique" color="#62daab" />
      </Chart>
    );
  };

  const CardTitle = () => {
    // Calcule le nombre total d'utilisateurs
    const sum =
      data && data.status !== 'error' && data.data
        ? data.data.reduce((a, b) => a + (b.Total || 0), 0)
        : 0;

    if (data && data.data) {
      return (
        <>
          <Text strong>Événements</Text>
          <br />
          <Text type="secondary">
            {/* eslint-disable-next-line */}
            {sum} aux total
          </Text>
        </>
      );
    }

    return <Text strong>Événements</Text>;
  };

  return (
    <Card
      bodyStyle={{ padding: 0, height: 250 }}
      title={<CardTitle />}
      headStyle={{ fontSize: 14 }}
    >
      <Stats />
    </Card>
  );
};

export default memo(Devices);
