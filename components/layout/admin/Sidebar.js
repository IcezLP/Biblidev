import React, { useState } from 'react';
import Link from 'next/link';
import MenuIcon from '../../../public/images/icons/feather/more-vertical.svg';
import UsersIcon from '../../../public/images/icons/feather/users.svg';
import Arrow from '../../../public/images/icons/feather/chevron-down.svg';
import ListIcon from '../../../public/images/icons/feather/list.svg';
import Plus from '../../../public/images/icons/feather/plus-circle.svg';

export default ({ onToggle }) => {
  const [dropdowns, setDropdowns] = useState({ users: false, resources: false });

  return (
    <nav className="layout__menu">
      <div className="menu__content">
        <div className="dropdown" data-open={dropdowns.users}>
          <span
            className="dropdown__title"
            onClick={() => setDropdowns({ users: !dropdowns.users })}
          >
            <span className="title__icon">
              <UsersIcon />
            </span>
            <span className="title__text">Utilisateurs</span>
            <span className="title__arrow" data-open={dropdowns.users}>
              <Arrow />
            </span>
          </span>
          <div className="dropdown_links">
            <Link href="/admin/users" as="/admin/utilisateurs">
              <a className="dropdown__link">
                <span className="link__icon">
                  <ListIcon />
                </span>
                Liste
              </a>
            </Link>
            <Link href="/admin/users/add" as="/admin/utilisateurs/ajout">
              <a className="dropdown__link">
                <span className="link__icon">
                  <Plus />
                </span>
                Ajout
              </a>
            </Link>
          </div>
        </div>
      </div>
      <span className="menu__icon" onClick={onToggle}>
        <MenuIcon />
      </span>
    </nav>
  );
};
