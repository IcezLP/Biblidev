import React, { useState } from 'react';
import { Layout, Menu, Affix, Drawer, Button } from 'antd';
import {
  MenuOutlined,
  HomeOutlined,
  PlusOutlined,
  AppstoreOutlined,
  TeamOutlined,
  TagOutlined,
  ControlOutlined,
  LayoutOutlined,
  MailOutlined,
  ExceptionOutlined,
  ImportOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import CustomScroll from 'react-custom-scroll';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MediaContextProvider, Media } from '../../../lib/media';

const { memo } = React;
const { Sider } = Layout;
const { SubMenu, Item } = Menu;

const routes = [
  {
    key: 'admin',
    href: '/admin',
    as: null,
    label: 'Tableau de bord',
    icon: <HomeOutlined />,
    disabled: false,
  },
  {
    key: 'users',
    href: '/admin/users',
    as: '/admin/utilisateurs',
    label: 'Utilisateurs',
    icon: <TeamOutlined />,
    disabled: true,
  },
  {
    key: 'categories',
    href: '/admin/categories',
    as: null,
    label: 'Catégories',
    icon: <TagOutlined />,
    disabled: false,
  },
  {
    key: 'resources',
    type: 'sub',
    label: 'Ressources',
    icon: <AppstoreOutlined />,
    disabled: false,
    routes: [
      {
        key: 'resources',
        href: '/admin/resources',
        as: '/admin/ressources',
        label: 'Gérer',
        icon: <ControlOutlined />,
        disabled: false,
      },
      {
        key: 'resources/add',
        href: '/admin/resources/add',
        as: '/admin/ressources/ajout',
        label: 'Ajouter',
        icon: <PlusOutlined />,
        disabled: false,
      },
      {
        key: 'resources/import',
        href: '/admin/resources/import',
        as: '/admin/ressources/importation',
        label: 'Importer',
        icon: <ImportOutlined />,
        disabled: false,
      },
      {
        key: 'resources/awaiting',
        href: '/admin/resources/awaiting',
        as: '/admin/ressources/validation',
        label: 'À valider',
        icon: <ClockCircleOutlined />,
        disabled: false,
      },
    ],
  },
  {
    key: 'templates',
    href: '/admin/templates',
    as: null,
    label: "Templates d'email",
    icon: <LayoutOutlined />,
    disabled: true,
  },
  {
    key: 'newsletter',
    href: '/admin/newsletter',
    as: null,
    label: 'Newsletter',
    icon: <MailOutlined />,
    disabled: true,
  },
  {
    key: 'logs',
    href: '/admin/logs',
    as: null,
    label: 'Logs',
    icon: <ExceptionOutlined />,
    disabled: true,
  },
];

const Links = ({ defaultOpenKeys, defaultSelectedKey }) => (
  <Menu
    theme="light"
    mode="inline"
    selectable={false}
    style={{ borderColor: 'transparent' }}
    defaultOpenKeys={[defaultOpenKeys]}
    defaultSelectedKeys={[defaultSelectedKey]}
  >
    {routes.map((route) => {
      // Si l'élément est un sous-menu
      if (route.type === 'sub') {
        return (
          <SubMenu key={route.key} title={route.label} icon={route.icon}>
            {route.routes.map(({ key, href, as, label, icon, disabled }) => (
              <Item key={key} disabled={disabled} style={{ paddingLeft: 48 }}>
                <Link href={href} as={as}>
                  <a>
                    {icon || null}
                    <span>{label}</span>
                  </a>
                </Link>
              </Item>
            ))}
          </SubMenu>
        );
      }

      // Affiche l'élément normalement
      return (
        <Item key={route.key} disabled={route.disabled} style={{ paddingLeft: 24 }}>
          <Link href={route.href} as={route.as}>
            <a>
              {route.icon ? route.icon : null}
              <span>{route.label}</span>
            </a>
          </Link>
        </Item>
      );
    })}
  </Menu>
);

const Sidebar = () => {
  const router = useRouter();
  // Visibilité du menu mobile & tablette
  const [visible, setVisible] = useState(false);
  // Largeur des menus
  const menuWidth = 230;
  // Sous-menu actif
  const openedKey = router.route.split('/')[2];
  // Page active
  const selectedKey = router.route === '/admin' ? 'admin' : router.route.split('/admin/').pop();

  return (
    <MediaContextProvider>
      {/* Sidebar desktop */}
      <Media greaterThanOrEqual="md" className="admin-sider-wrapper">
        <Affix offsetTop={0}>
          <Sider theme="light" className="admin-sider" width={menuWidth}>
            <Links defaultOpenKeys={openedKey} defaultSelectedKey={selectedKey} />
          </Sider>
        </Affix>
      </Media>
      {/* Sidebar mobile & tablette */}
      <Media lessThan="md">
        {/* Si la sidebar mobile & tablette est visible on cache le bouton */}
        {!visible && (
          <Button
            className="drawer-handle"
            onClick={() => setVisible(true)}
            icon={<MenuOutlined />}
          />
        )}
        <Drawer
          placement="left"
          className="admin-drawer"
          visible={visible}
          closable
          width={menuWidth}
          onClose={() => setVisible(false)}
          bodyStyle={{ padding: '50px 0 0 0' }}
        >
          <CustomScroll heightRelativeToParent="100%">
            <Links defaultOpenKeys={openedKey} defaultSelectedKey={selectedKey} />
          </CustomScroll>
        </Drawer>
      </Media>
    </MediaContextProvider>
  );
};

export default memo(Sidebar);
