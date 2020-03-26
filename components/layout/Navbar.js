import React, { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import cookies from 'js-cookie';
import Logo from '../../public/images/logo_inline.svg';
import MenuIcon from '../../public/images/icons/feather/menu.svg';

export default ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Déconnexion
  const removeAuthToken = () => {
    // Supprime le cookie de connexion
    cookies.remove('auth');
    // Redirige sur la page d'accueil
    Router.push('/');
  };

  const AuthMenu = (
    <>
      <li className="navbar__link">
        <a href="#" onClick={removeAuthToken}>
          Déconnexion
        </a>
      </li>
    </>
  );

  const DefaultMenu = (
    <>
      <li className="navbar__link">
        <Link href="/auth/login" as="/connexion">
          <a>Connexion</a>
        </Link>
      </li>
    </>
  );

  return (
    <nav className="navbar" data-expanded={isOpen}>
      <div className="navbar__logo">
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>
      </div>
      <button type="button" className="navbar__toggle" onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon />
      </button>
      <span className="navbar__break" />
      <ul className="navbar__menu" data-open={isOpen}>
        {user ? AuthMenu : DefaultMenu}
      </ul>
    </nav>
  );
};
