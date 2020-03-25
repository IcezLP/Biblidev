import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '../../public/images/logo_inline.svg';
import MenuIcon from '../../public/images/icons/feather/menu.svg';

export default () => {
  const [isOpen, setIsOpen] = useState(false);

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
        <li className="navbar__link">
          <Link href="/auth/login" as="/connexion">
            <a>Connexion</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
