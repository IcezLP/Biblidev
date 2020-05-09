import React from 'react';
import { Result, Button } from 'antd';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import withAuth from '../../middlewares/withAuth';
import fetch from '../../lib/fetch';
import { logEvent } from '../../services/google-analytics';

const Verify = ({ status, message }) => {
  if (status === 200) {
    logEvent('User', "Vérification de l'adresse mail");
  }

  return (
    <>
      <NextSeo title="Vérification de l'adresse mail" />
      <Result
        status={status === 404 ? 'error' : 'success'}
        title={status === 404 ? 'Échec de la validation' : 'Validation réussie !'}
        subTitle={message}
        extra={[
          status === 404 ? (
            <Button type="primary" key="home">
              <Link href="/">
                <a>Retourner à l'accueil</a>
              </Link>
            </Button>
          ) : (
            <Button type="primary" key="login">
              <Link href="/auth/login" as="/connexion">
                <a>Connexion</a>
              </Link>
            </Button>
          ),
        ]}
      />
    </>
  );
};

Verify.getInitialProps = async ({ query }) => {
  if (!query.token) {
    return { status: 404, message: 'Aucun token spécifié' };
  }

  const response = await fetch('post', `/api/auth/verify/${query.token}`);

  return { status: response.status !== 'success' ? 404 : 200, message: response.message };
};

export default withAuth(Verify, { logoutRequired: true });
