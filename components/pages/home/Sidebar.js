import React from 'react';
import { Layout, Menu, Icon, Radio } from 'antd';
import CustomScroll from 'react-custom-scroll';
import { DollarOutlined } from '@ant-design/icons';

export default ({
  collapsible,
  collapsed,
  width,
  onCollapse,
  categories,
  handleFilter,
  handleCategoriesFilter,
  filters,
  handleIncludeChange,
  includes,
}) => (
  <Layout.Sider
    id="sidebar"
    collapsible={collapsible}
    collapsed={collapsed}
    collapsedWidth={0}
    onCollapse={onCollapse}
    theme="light"
    width={width}
    zeroWidthTriggerStyle={{ border: '1px solid #f0f2f5' }}
    style={{ transition: !collapsible && 'none' }}
  >
    <CustomScroll heightRelativeToParent="100%">
      {/* <Menu mode="inline" theme="light" className="menu" selectedKeys={[filters.price]}>
        <Menu.ItemGroup key="prices" title="Prix">
          <Menu.Item key="gratuit" type="price" onClick={handleFilter}>
            <DollarOutlined style={{ color: '#52c41a', fontSize: '19px' }} />
            Gratuits
          </Menu.Item>
          <Menu.Item key="gratuit-et-payant" type="price" onClick={handleFilter}>
            <DollarOutlined style={{ color: '#fa8c16', fontSize: '19px' }} />
            Gratuits ou Payants
          </Menu.Item>
          <Menu.Item key="payant" type="price" onClick={handleFilter}>
            <DollarOutlined style={{ color: '#f5222d', fontSize: '19px' }} />
            Payants
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu> */}
      <Menu mode="inline" theme="light" className="menu">
        <Menu.ItemGroup title="Mode de tri des catégories">
          <Radio.Group
            style={{ paddingLeft: 24, paddingRight: 16 }}
            onChange={handleIncludeChange}
            value={includes}
          >
            <Radio value="in" style={{ whiteSpace: 'unset' }}>
              Contient au moins 1 séléction
            </Radio>
            <Radio value="all" style={{ whiteSpace: 'unset' }}>
              Contient toute la séléction
            </Radio>
          </Radio.Group>
        </Menu.ItemGroup>
      </Menu>
      <Menu mode="inline" theme="light" className="menu" selectedKeys={filters.categories}>
        <Menu.ItemGroup key="categories" title="Catégories">
          {categories.map((category) => (
            <Menu.Item key={category._id} type="categories" onClick={handleCategoriesFilter}>
              {category.plural_name}
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      </Menu>
    </CustomScroll>
  </Layout.Sider>
);
