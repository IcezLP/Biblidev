import React from 'react';
import useSWR from 'swr';
import { Card, Spin, Result, Typography } from 'antd';
import { LoadingOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Chart, Interval, Tooltip, Axis, Geom, Coordinate } from 'bizcharts';
import fetch from '../../../../../lib/fetch';

const { memo } = React;
const { Text } = Typography;

const Devices = ({ start, end }) => {
  const { data } = useSWR(
    `/api/admin/analytics/devices?start=${start}&end=${end}`,
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
    if (!data.data || data.data.length === 0) {
      return (
        <Result
          icon={<InfoCircleOutlined style={{ fontSize: 32 }} />}
          subTitle="Aucune donnée à afficher"
        />
      );
    }

    return (
      <Chart padding={[20, 20, 30, 20]} height="100%" data={data.data} pixelRatio={3} autoFit>
        <Coordinate type="theta" radius={0.75} innerRadius={0.6} />
        <Tooltip showTitle={false} />
        <Axis visible={false} />
        <Geom
          type="interval"
          adjust="stack"
          position="percent"
          color="item"
          tooltip={[
            'item*percent*value',
            (item, percent, value) => {
              return {
                name: item,
                value: `${value} (${percent} %)`,
              };
            },
          ]}
          style={{
            lineWidth: 1,
            stroke: '#fff',
          }}
        />
      </Chart>
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
          <Text strong>Appareils</Text>
          <br />
          <Text type="secondary">
            {/* eslint-disable-next-line */}
            {sum} aux total
          </Text>
        </>
      );
    }

    return <Text strong>Appareils</Text>;
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
