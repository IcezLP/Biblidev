/* eslint-disable */
import React from 'react';
import useSWR from 'swr';
import { Card, Spin, Result, Descriptions, Typography, Badge, Progress } from 'antd';
import { LoadingOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import fetch from '../../../../lib/fetch';
import bytes from 'bytes';
import moment from 'moment';

const { memo } = React;
const { Text } = Typography;
const { Item } = Descriptions;

const Devices = () => {
  const { data } = useSWR(`/api/admin/dashboard/server`, (url) => fetch('get', url));

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
    if (!data.data) {
      return (
        <Result
          icon={<InfoCircleOutlined style={{ fontSize: 32 }} />}
          subTitle="Aucune donnée à afficher"
        />
      );
    }

    const { versions, time, osInfo, mem, fsSize, expressUptime } = data.data;
    const { total, used } = mem;
    const { platform, release, kernel, distro, arch } = osInfo;
    const { apache, git, nginx, node, npm } = versions;

    return (
      <Descriptions
        bordered
        size="small"
        layout="vertical"
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      >
        <Item label="État">
          <Badge
            status="processing"
            text={`Express actif depuis ${moment.utc(expressUptime * 1000).format('HH:mm:ss')}`}
          />
          <br />
          <Badge
            status="processing"
            text={`OS actif depuis ${moment.utc(time.uptime * 1000).format('HH:mm:ss')}`}
          />
        </Item>
        <Item label="Mémoire">
          <Progress type="dashboard" width={80} percent={Math.round((used / total) * 100)} />
          <br />
          {bytes(used, { unit: 'GB' }) || 0} / {bytes(total, { unit: 'GB' }) || 0}
        </Item>
        <Item label="OS">
          Plateforme : {platform || <Text type="secondary">Innaccessible</Text>}
          <br />
          Release : {release || <Text type="secondary">Innaccessible</Text>}
          <br />
          Kernel : {kernel || <Text type="secondary">Innaccessible</Text>}
          <br />
          Distribution : {distro || <Text type="secondary">Innaccessible</Text>}
          <br />
          Arch : {arch || <Text type="secondary">Inaccessible</Text>}
          <br />
        </Item>
        <Item label="Versions">
          Apache : {apache || <Text type="secondary">Non installé</Text>}
          <br />
          Git : {git || <Text type="secondary">Non installé</Text>}
          <br />
          MongoDB : Hébergé sur MLab
          <br />
          NGINX : {nginx || <Text type="secondary">Non installé</Text>}
          <br />
          Node : {node || <Text type="secondary">Non installé</Text>}
          <br />
          NPM : {npm || <Text type="secondary">Non installé</Text>}
        </Item>
        <Item label="Stockage">
          {fsSize.map((fs) => (
            <div key={fs.fs}>
              {fs.fs}
              <Progress
                type="line"
                percent={Math.round(fs.use)}
                strokeColor={Math.round(fs.use) > 90 ? '#ff4d4f' : null}
              />
              {bytes(fs.used, { unit: 'GB' })} / {bytes(fs.size, { unit: 'GB' })}
            </div>
          ))}
        </Item>
      </Descriptions>
    );
  };

  return (
    <Card
      title={
        <Text strong style={{ fontSize: 14 }}>
          Serveur
        </Text>
      }
      bodyStyle={{ padding: 0 }}
    >
      <Stats />
    </Card>
  );
};

export default memo(Devices);
