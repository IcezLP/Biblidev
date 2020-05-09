import React from 'react';
import { Card, Spin, Result, Typography } from 'antd';
import { Chart, Line, Point } from 'bizcharts';
import { LoadingOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import useSWR from 'swr';
import fetch from '../../../../../lib/fetch';

const { memo } = React;
const { Text } = Typography;

const LineChart = ({ title, metrics, start, end }) => {
  const { data } = useSWR(
    `/api/admin/analytics?metrics=${metrics}&start=${start}&end=${end}`,
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
      <Chart
        scale={{ Utilisateurs: { min: 0 } }}
        padding={[30, 20, 50, 40]}
        autoFit
        height="100%"
        data={data.data}
        pixelRatio={3}
      >
        <Line shape="line" position="Date*Utilisateurs" size={1} />
        <Point position="Date*Utilisateurs" />
      </Chart>
    );
  };

  const CardTitle = () => {
    // Calcule le nombre total d'utilisateurs
    const sum =
      data && data.status !== 'error' && data.data
        ? data.data.reduce((a, b) => a + (b.Utilisateurs || 0), 0)
        : 0;

    if (data && data.data) {
      return (
        <>
          <Text strong>{title}</Text>
          <br />
          <Text type="secondary">
            {/* eslint-disable-next-line */}
            {sum} aux total
          </Text>
        </>
      );
    }

    return <Text strong>{title}</Text>;
  };

  return (
    <Card
      bodyStyle={{ padding: 0, height: 200 }}
      title={<CardTitle />}
      headStyle={{ fontSize: 14 }}
    >
      <Stats />
    </Card>
  );
};

export default memo(LineChart);
