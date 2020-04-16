import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';

export default ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout className="admin" hasSider>
      <Sidebar collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
      <Layout.Content className="admin__content">{children}</Layout.Content>
    </Layout>
  );
};
