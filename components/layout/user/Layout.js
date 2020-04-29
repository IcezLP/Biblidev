import React from 'react';
import { Tabs } from 'antd';
import { useRouter } from 'next/router';
import Header from './Header';

export default (props) => {
  const router = useRouter();

  const routes = [
    { path: '/user/dashboard', as: '/tableau-de-bord', name: 'Tableau de bord', key: 'dashboard' },
    { path: '/user/settings', as: '/parametres', name: 'Paramètres', key: 'settings' },
  ];

  const handleRouteChange = (key) => {
    // Séléctionne la route
    const route = routes.find((item) => item.key === key);
    // Redirige vers la page demandé
    router.push(route.path, route.as);
  };

  return (
    <div style={{ margin: 20 }}>
      <Header {...props} />
      <Tabs activeKey={router.route.split('/')[2]} onTabClick={handleRouteChange}>
        {routes.map(({ name, key }) => (
          <Tabs.TabPane tab={name} key={key} />
        ))}
      </Tabs>
    </div>
  );
};
