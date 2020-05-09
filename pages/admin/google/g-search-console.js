import React from 'react';
import withAuth from '../../../middlewares/withAuth';
import Layout from '../../../components/layout/admin/Layout';

const Dashboard = () => (
  <Layout
    title="Google Search Console"
    subTitle="Données d'analyse en provenance de Google Search Console"
  />
);

export default withAuth(Dashboard, { loginRequired: true, adminRequired: true });
