import React from 'react';
import { Row, Tabs, Col } from 'antd';
import { useRouter } from 'next/router';
import Profile from './Profile';

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
    <div className="user-wrapper">
      <Row>
        <Profile {...props} />
        <Col xs={24} sm={17} lg={20} className="user-content">
          <Tabs activeKey={router.route.split('/')[2]} onTabClick={handleRouteChange}>
            {routes.map(({ name, key }) => (
              <Tabs.TabPane tab={name} key={key} />
            ))}
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};
