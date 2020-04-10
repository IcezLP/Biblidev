import React, { useState } from 'react';
import { Layout, Row, Col } from 'antd';
import classnames from 'classnames';
import useSWR from 'swr';
import withAuth from '../middlewares/withAuth';
import Hero from '../components/pages/home/Hero';
import useWindowSize from '../hooks/useWindowSize';
import Sidebar from '../components/pages/home/Sidebar';
import fetch from '../lib/fetch';
import Card from '../components/pages/home/Card';

const Home = ({ user, initialCategories, initialResources }) => {
  const [collapsed, setCollapsed] = useState(true);
  const { width } = useWindowSize();
  const sidebarWidth = 230;

  const {
    data: {
      data: { categories },
    },
  } = useSWR('/api/categories', (url) => fetch('get', url), {
    initialData: initialCategories,
  });

  const {
    data: {
      data: { resources },
    },
  } = useSWR('/api/resources', (url) => fetch('get', url), {
    initialData: initialResources,
  });

  return (
    <Layout className={classnames('home', { layout__admin: user && user.isAdmin })}>
      <Sidebar
        collapsible={width < 1200}
        collapsed={width < 1200 && collapsed}
        width={sidebarWidth}
        onCollapse={() => setCollapsed(!collapsed)}
        isAdmin={user && user.isAdmin}
        categories={categories}
      />
      <Layout.Content style={{ marginLeft: width < 1200 ? 0 : sidebarWidth }} id="content">
        <Hero />
        <Row gutter={[12, 12]} type="flex">
          {resources.map((resource) => (
            <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={4} key={resource._id}>
              <Card resource={resource} />
            </Col>
          ))}
        </Row>
      </Layout.Content>
    </Layout>
  );
};

Home.getInitialProps = async () => {
  const initialCategories = await fetch('get', '/api/categories');
  const initialResources = await fetch('get', '/api/resources');

  return { initialCategories, initialResources };
};

export default withAuth(Home);
