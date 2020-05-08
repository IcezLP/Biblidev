import React from 'react';
import Link from 'next/link';
import { Layout, Menu, Popover, Button, Dropdown, Avatar, Divider } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Logo from '../../../../public/images/logo_inline.svg';
import { MediaContextProvider, Media } from '../../../../lib/media';
import AuthenticatedMenu from './AuthenticatedMenu';

const { memo } = React;
const { Header } = Layout;
const { Item } = Menu;

const Navbar = ({ user }) => {
  // Récupère la première lettre du nom d'utilisateur
  const firstUsernameLetter = user ? user.username.charAt(0).toUpperCase() : null;

  // Lien de connexion
  const LoginLink = (props) => (
    <Item key="login" {...props}>
      <Link href="/auth/login" as="/connexion">
        <a>Connexion</a>
      </Link>
    </Item>
  );

  // Liens toujours affichés
  const GlobalLinks = (props) => {
    const routes = [];

    Item.defaultProps = { ...props };

    return routes.map((route) => (
      <Item key={route.key}>
        <Link href={route.href} as={route.as}>
          <a>{route.label}</a>
        </Link>
      </Item>
    ));
  };

  return (
    <MediaContextProvider>
      <Header className="navbar">
        {/* Logo */}
        <div className="navbar-logo">
          <Link href="/">
            <a>
              <Logo />
            </a>
          </Link>
        </div>
        <div className="navbar-links">
          {/* Menu tablette & desktop */}
          <Media greaterThanOrEqual="sm">
            <Menu mode="horizontal" selectable={false}>
              <GlobalLinks />
              {user ? (
                <Dropdown
                  trigger={['click']}
                  placement="bottomRight"
                  className="user-dropdown"
                  overlay={
                    <Menu>
                      <AuthenticatedMenu />
                    </Menu>
                  }
                >
                  <span>
                    {user.username}
                    &nbsp;
                    <Avatar src={user.avatar}>{firstUsernameLetter}</Avatar>
                  </span>
                </Dropdown>
              ) : (
                <Menu mode="horizontal" selectable={false}>
                  <LoginLink />
                </Menu>
              )}
            </Menu>
          </Media>
          {/* Menu mobile */}
          <Media lessThan="sm">
            <Popover
              trigger="click"
              placement="bottomRight"
              overlayClassName="user-popover"
              content={
                <Menu mode="vertical" selectable={false}>
                  <GlobalLinks />
                  <Divider style={{ margin: 0 }} />
                  {user ? (
                    <AuthenticatedMenu />
                  ) : (
                    <Item key="login">
                      <Link href="/auth/login" as="/connexion">
                        <a>Connexion</a>
                      </Link>
                    </Item>
                  )}
                </Menu>
              }
            >
              <Button icon={<MenuOutlined />} />
            </Popover>
          </Media>
        </div>
      </Header>
    </MediaContextProvider>
  );
};

export default memo(Navbar);
