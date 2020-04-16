import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import Header from './Header';

export default ({ children, title, subTitle }) => {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    let storedCollapsedState = localStorage.getItem('collapsed');

    if (storedCollapsedState) {
      storedCollapsedState = JSON.parse(storedCollapsedState);
      setCollapsed(storedCollapsedState);
    }
  }, []);

  const collapse = () => {
    localStorage.setItem('collapsed', !collapsed);
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="admin" hasSider>
      <Sidebar collapsed={collapsed} onCollapse={collapse} />
      <Layout.Content className="admin__content">
        <Header title={title} subTitle={subTitle} />
        {children}
      </Layout.Content>
    </Layout>
  );
};
