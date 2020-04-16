import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import cookies from 'js-cookie';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import classnames from 'classnames';
import Logo from '../../public/images/logo_inline.svg';

export default ({ user }) => {
  // Déconnexion
  const removeAuthToken = () => {
    // Supprime le cookie de connexion
    cookies.remove('auth');
    // Redirige sur la page d'accueil
    Router.push('/');
  };

  const userMenu = () => (
    <Menu theme="light">
      <Menu.Item key="dashboard" className="navbar__link">
        <Link href="/dashboard" as="/tableau-de-bord">
          <a>Tableau de bord</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="settings" className="navbar__link">
        <Link href="/settings" as="/parametres">
          <a>Paramètres</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="logout" className="navbar__link">
        <a href="#" onClick={removeAuthToken}>
          Déconnexion
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout.Header id="header" className={classnames({ navbar__admin: user && user.isAdmin })}>
      {user && user.isAdmin && (
        <div className="navbar__admin-menu">
          <div>Icônes</div>
          <Link href="/admin">
            <a>Administration</a>
          </Link>
        </div>
      )}
      <div className="navbar">
        <div className="navbar__logo">
          <Link href="/">
            <a>
              <Logo />
            </a>
          </Link>
        </div>
        <Menu mode="horizontal" selectable={false} className="navbar__links">
          {user ? (
            <Dropdown
              trigger={['click']}
              placement="bottomRight"
              overlay={userMenu}
              className="navbar__dropdown"
            >
              <span>
                {user.username}
                &nbsp;
                {user.avatar ? (
                  <Avatar src={user.avatar} />
                ) : (
                  <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
                )}
              </span>
            </Dropdown>
          ) : (
            <Menu.Item key="login" className="navbar__link">
              <Link href="/auth/login" as="/connexion">
                <a>Connexion</a>
              </Link>
            </Menu.Item>
          )}
        </Menu>
      </div>
    </Layout.Header>
  );
};
