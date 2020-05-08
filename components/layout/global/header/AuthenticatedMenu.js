import React from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import cookies from 'js-cookie';

const { memo } = React;
const { Item } = Menu;

// Routes des pages utilisateur
const routes = [
  { key: 'dashboard', label: 'Tableau de bord', href: '/user/dashboard', as: '/tableau-de-bord' },
  { key: 'settings', label: 'Paramètres', href: '/user/settings', as: '/parametres' },
];

const AuthenticatedMenu = (props) => {
  // Déconnexion
  const removeAuthToken = () => {
    // Supprime le cookie de connexion
    cookies.remove('auth');
    // Redirige sur la page d'accueil
    Router.push('/');
  };

  Item.defaultProps = { ...props };

  return (
    <>
      {routes.map((route) => (
        <Item key={route.key}>
          <Link href={route.href} as={route.as}>
            <a>{route.label}</a>
          </Link>
        </Item>
      ))}
      <Menu.Item key="logout" {...props}>
        <a href="#" onClick={removeAuthToken}>
          Déconnexion
        </a>
      </Menu.Item>
    </>
  );
};
export default memo(AuthenticatedMenu);
