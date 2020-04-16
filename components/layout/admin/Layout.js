import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import Header from './Header';
import useWindowSize from '../../../hooks/useWindowSize';

export default ({ children, title, subTitle }) => {
  const { width } = useWindowSize();
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
      <Layout.Content
        className="admin__content"
        style={{ marginLeft: width > 1200 && !collapsed ? '200px' : '80px' }}
      >
        <Header title={title} subTitle={subTitle} />
        {children}
      </Layout.Content>
    </Layout>
  );
};
