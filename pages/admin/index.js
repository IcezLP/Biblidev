import React from 'react';
import withAuth from '../../middlewares/withAuth';
import Layout from '../../components/layout/admin/Layout';

export default withAuth(
  () => (
    <Layout>
      <p />
    </Layout>
  ),
  { adminRequired: true },
);
