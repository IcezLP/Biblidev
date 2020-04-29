import React from 'react';
import { NextSeo } from 'next-seo';
import withAuth from '../../middlewares/withAuth';

export default withAuth(
  () => (
    <>
      <NextSeo title="Paramètres de mon compte" />
      <p>Paramètres</p>
    </>
  ),
  { loginRequired: true },
);
