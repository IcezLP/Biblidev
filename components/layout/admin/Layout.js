import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import Header from './Header';
import useWindowSize from '../../../hooks/useWindowSize';

export default ({ children, title, subTitle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { width } = useWindowSize();

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

  const marginLeft = () => {
    if (collapsed || (width && width < 1200)) {
      return '80px';
    }

    return '200px';
  };

  return (
    <Layout className="admin" hasSider>
      <Sidebar collapsed={collapsed} onCollapse={collapse} />
      <Layout.Content className="admin__content" style={{ marginLeft: 200 }}>
        <Header title={title} subTitle={subTitle} />
        {children}
      </Layout.Content>
    </Layout>
  );
};
