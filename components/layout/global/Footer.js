import React from 'react';
import { Layout } from 'antd';

const { memo } = React;

const Footer = () => {
  // Récupère l'année en cours
  const actualYear = new Date().getFullYear();

  return (
    <Layout.Footer style={{ textAlign: 'center', height: 70 }}>
      {/* eslint-disable-next-line */}
      Biblidev 2019 - {actualYear}
    </Layout.Footer>
  );
};

export default memo(Footer);
