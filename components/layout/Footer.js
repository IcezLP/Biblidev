import React from 'react';
import { Layout } from 'antd';

const { memo } = React;

const Footer = () => (
  <Layout.Footer style={{ textAlign: 'center' }}>
    {/* eslint-disable-next-line */}
    Biblidev 2019 - {new Date().getFullYear()}
  </Layout.Footer>
);

export default memo(Footer);
