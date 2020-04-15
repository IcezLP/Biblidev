import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import CustomScroll from 'react-custom-scroll';

export default ({
  collapsible,
  collapsed,
  width,
  onCollapse,
  categories,
  handleFilter,
  filters,
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
      <Menu
        mode="inline"
        theme="light"
        multiple="false"
        className="menu"
        selectedKeys={[filters.price]}
      >
        <Menu.ItemGroup key="prices" title="Prix">
          <Menu.Item key="gratuit" type="price" onClick={handleFilter}>
            <Icon type="dollar" style={{ color: '#52c41a', fontSize: '19px' }} />
            Gratuits
          </Menu.Item>
          <Menu.Item key="gratuit-et-payant" type="price" onClick={handleFilter}>
            <Icon type="dollar" style={{ color: '#fa8c16', fontSize: '19px' }} />
            Gratuits ou Payants
          </Menu.Item>
          <Menu.Item key="payant" type="price" onClick={handleFilter}>
            <Icon type="dollar" style={{ color: '#f5222d', fontSize: '19px' }} />
            Payants
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
      <Menu mode="inline" theme="light" className="menu" selectedKeys={[filters.category]}>
        <Menu.ItemGroup key="categories" title="Catégories">
          {categories.map((category) => (
            <Menu.Item key={category._id} type="category" onClick={handleFilter}>
              {category.plural_name}
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      </Menu>
    </CustomScroll>
  </Layout.Sider>
);
