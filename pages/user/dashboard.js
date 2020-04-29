import React from 'react';
import { NextSeo } from 'next-seo';
import withAuth from '../../middlewares/withAuth';
import Layout from '../../components/layout/user/Layout';

export default withAuth(
  (props) => (
    <>
      <NextSeo title="Mon tableau de bord" />
      <Layout {...props}>
        <p>Tableau de bord</p>
      </Layout>
    </>
  ),
  { loginRequired: true },
);
