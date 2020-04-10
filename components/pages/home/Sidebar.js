import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import CustomScroll from 'react-custom-scroll';

export default ({ collapsible, collapsed, width, onCollapse, isAdmin, categories }) => (
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
      <Menu mode="inline" theme="light" multiple="false" className="menu">
        <Menu.ItemGroup key="prices" title="Prix">
          <Menu.Item key="gratuit" type="price">
            <Icon type="dollar" style={{ color: '#52c41a', fontSize: '19px' }} />
            Gratuits
          </Menu.Item>
          <Menu.Item key="gratuit-et-payant" type="price">
            <Icon type="dollar" style={{ color: '#fa8c16', fontSize: '19px' }} />
            Gratuits ou Payants
          </Menu.Item>
          <Menu.Item key="payant" type="price">
            <Icon type="dollar" style={{ color: '#f5222d', fontSize: '19px' }} />
            Payants
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
      <Menu mode="inline" theme="light" className="menu">
        <Menu.ItemGroup key="categories" title="Catégories">
          {categories.map((category) => (
            <Menu.Item key={category._id} type="category">
              {category.plural_name}
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      </Menu>
    </CustomScroll>
  </Layout.Sider>
);
