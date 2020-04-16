import React from 'react';
import { Layout, Menu, Badge, Divider } from 'antd';
import {
  TeamOutlined,
  TagOutlined,
  ExceptionOutlined,
  MailOutlined,
  HomeOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  ImportOutlined,
  ControlOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import useSWR from 'swr';
import fetch from '../../../lib/fetch';

export default ({ collapsed, onCollapse }) => {
  const { data } = useSWR('/api/resources/awaiting', (url) => fetch('get', url));

  const awaitingResources = () => {
    if (!data) {
      return <LoadingOutlined style={{ color: '#f5222d', paddingLeft: '15px' }} />;
    }

    if (data.status === 'error') {
      return <ExclamationCircleOutlined style={{ color: '#f5222d' }} />;
    }

    return data.data.resources.length;
  };

  return (
    <Layout.Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      className="admin__sidebar"
    >
      <Menu theme="light" mode="inline" className="menu" selectable={false}>
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
        <Menu.SubMenu
          key="resources"
          title={
            <span>
              <AppstoreOutlined />
              <span>Ressources</span>
            </span>
          }
        >
          {collapsed && (
            <Menu.Item
              key="title"
              style={{
                textAlign: 'center',
                color: 'rgba(0, 0, 0, 0.65)',
              }}
            >
              Ressources
            </Menu.Item>
          )}
          <Divider />
          <Menu.Item key="manage" disabled>
            <Link href="/admin/resources" as="/admin/ressources">
              <a>
                <ControlOutlined />
                <span>Gérer</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="add" disabled>
            <Link href="/admin/resources/add" as="/admin/ressources/ajout">
              <a>
                <PlusOutlined />
                <span>Ajouter</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="import" disabled>
            <Link href="/admin/resources/import" as="/admin/ressources/importation">
              <a>
                <ImportOutlined />
                <span>Importer</span>
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="awaiting" disabled>
            <Link href="/admin/resources/awaiting" as="/admin/ressources/validation">
              <a>
                <Badge count={awaitingResources()} showZero offset={[15, 8]}>
                  <span>
                    <ClockCircleOutlined />
                    <span>À valider</span>
                  </span>
                </Badge>
              </a>
            </Link>
          </Menu.Item>
        </Menu.SubMenu>
        {/* <Menu.Item key="test" disabled>
        <Link href="/admin/resources" as="/admin/ressources">
          <a>
            <AppstoreOutlined />
            <span>Ressources</span>
          </a>
        </Link>
      </Menu.Item> */}
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
};
