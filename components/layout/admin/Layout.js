import React from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import Header from './Header';

const { Content } = Layout;

export default ({ children, title, subTitle }) => (
  <Layout className="admin-wrapper">
    <Sidebar />
    <Content className="admin-content">
      <Header title={title} subTitle={subTitle} />
      {children}
    </Content>
  </Layout>
);
