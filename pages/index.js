import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Spin, Result } from 'antd';
import classnames from 'classnames';
import useSWR from 'swr';
import { FrownOutlined, LoadingOutlined } from '@ant-design/icons';
import withAuth from '../middlewares/withAuth';
import Hero from '../components/pages/home/Hero';
import useWindowSize from '../hooks/useWindowSize';
import Sidebar from '../components/pages/home/Sidebar';
import fetch from '../lib/fetch';
import Card from '../components/pages/home/Card';
import Search from '../components/pages/home/Search';
import useSearch from '../hooks/useSearch';

const Home = ({ user, initialCategories }) => {
  const [collapsed, setCollapsed] = useState(true);
  const { width } = useWindowSize();
  const sidebarWidth = 230;
  const [filters, setFilters] = useState({ price: '', category: '' });
  const { search, handleSearch, sortBy, handleSort } = useSearch('newest');

  const handleFilter = (event) => {
    if (event.persist) event.persist();
    const key = event.item.props.type;
    const value = event.key;

    if (filters[key] === value) {
      return setFilters((previous) => ({
        ...previous,
        [key]: '',
      }));
    }

    return setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const categories = useSWR('/api/categories', (url) => fetch('get', url), {
    refreshInterval: 0,
    initialData: initialCategories,
  });

  const {
    data,
    mutate,
  } = useSWR(
    `/api/resources?search=${search}&sort=${sortBy}&price=${filters.price}&category=${filters.category}`,
    (url) => fetch('get', url),
    { refreshInterval: 0 },
  );

  useEffect(() => {
    const response = fetch(
      'get',
      `/api/resources?search=${search}&sort=${sortBy}&price=${filters.price}&category=${filters.category}`,
    );
    mutate(response);
  }, [search, sortBy, filters]);

  const Resources = () => {
    if (!data) {
      return (
        <Row style={{ margin: '20px 0' }} type="flex" justify="center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </Row>
      );
    }

    if (data.status === 'error' || !data.data.resources) {
      return <Result status="error" title="Une erreur est survenue, veuillez réessayez" />;
    }

    if (data.data.resources.length === 0) {
      return <Result icon={<FrownOutlined />} title="Aucun résultat" />;
    }

    return (
      <Row gutter={[12, 12]} type="flex">
        {data.data.resources.map((item) => (
          <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={4} key={item._id}>
            <Card resource={item} user={user} />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <Layout className={classnames('home', { layout__admin: user && user.isAdmin })} hasSider>
      <Sidebar
        collapsible={width < 1200}
        collapsed={width < 1200 && collapsed}
        width={sidebarWidth}
        onCollapse={() => setCollapsed(!collapsed)}
        isAdmin={user && user.isAdmin}
        categories={categories.data.data.categories}
        handleFilter={handleFilter}
        filters={filters}
      />
      <Layout.Content
        style={{
          marginLeft: width < 1200 ? 0 : sidebarWidth,
        }}
        id="content"
      >
        <Hero />
        <Search search={search} onChange={handleSearch} sort={sortBy} onSort={handleSort} />
        <Resources />
      </Layout.Content>
    </Layout>
  );
};

Home.getInitialProps = async () => {
  const initialCategories = await fetch('get', '/api/categories');
  const initialResources = await fetch('get', '/api/resources?sort=newest');

  return { initialCategories, initialResources };
};

export default withAuth(Home);
