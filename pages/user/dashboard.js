import React from 'react';
import { NextSeo } from 'next-seo';
import withAuth from '../../middlewares/withAuth';

export default withAuth(
  () => (
    <>
      <NextSeo title="Mon tableau de bord" />
      <p>Tableau de bord</p>
    </>
  ),
  { loginRequired: true },
);
