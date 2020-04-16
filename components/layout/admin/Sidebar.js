import React from 'react';
import { Layout, Menu } from 'antd';
import {
  TeamOutlined,
  TagOutlined,
  ExceptionOutlined,
  MailOutlined,
  HomeOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

export default ({ collapsed, onCollapse }) => (
  <Layout.Sider
    theme="light"
    collapsible
    collapsed={collapsed}
    onCollapse={onCollapse}
    className="admin__sidebar"
  >
    <Menu theme="light" mode="inline" className="menu">
      <Menu.Item key="dashboard">
        <Link href="/admin">
          <a>
            <HomeOutlined />
            <span>Tableau de contrôle</span>
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="users" disabled>
        <Link href="/admin/users" as="/admin/utilisateurs">
          <a>
            <TeamOutlined />
            <span>Utilisateurs</span>
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="categories" disabled>
        <Link href="/admin/categories">
          <a>
            <TagOutlined />
            <span>Catégories</span>
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="resources" disabled>
        <Link href="/admin/resources" as="/admin/ressources">
          <a>
            <AppstoreOutlined />
            <span>Ressources</span>
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="newsletter" disabled>
        <Link href="/admin/newsletter">
          <a>
            <MailOutlined />
            <span>Newsletter</span>
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="logs" disabled>
        <Link href="/admin/logs">
          <a>
            <ExceptionOutlined />
            <span>Logs</span>
          </a>
        </Link>
      </Menu.Item>
    </Menu>
  </Layout.Sider>
);
