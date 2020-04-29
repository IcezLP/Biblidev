import React from 'react';
import { NextSeo } from 'next-seo';
import withAuth from '../../middlewares/withAuth';
import Layout from '../../components/layout/user/Layout';

export default withAuth(
  (props) => (
    <>
      <NextSeo title="Paramètres de mon compte" />
      <Layout {...props}>
        <p>Paramètres</p>
      </Layout>
    </>
  ),
  { loginRequired: true },
);
