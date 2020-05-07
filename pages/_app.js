import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { DefaultSeo } from 'next-seo';
import { Layout, BackTop } from 'antd';
import classnames from 'classnames';
import { SWRConfig } from 'swr';
import { isIE } from 'react-device-detect';
import SEO from '../next-seo.config';
import Header from '../components/layout/Header';
import { initGA, logPageView } from '../services/google-analytics';
import Footer from '../components/layout/Footer';
import Unsupported from '../components/Unsupported';

// Configuration de NProgress
NProgress.configure({ showSpinner: false });

// Évènements de changement de routes (url)
Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeError = () => NProgress.done();
Router.onRouteChangeComplete = () => {
  NProgress.done();
  // Enregistre la page visitée
  logPageView();
};

class CustomApp extends App {
  componentDidMount() {
    // Si Google Analytics n'est pas initialisé
    if (!window.GA_INITIALIZED) {
      // Initialise Google Analytics
      initGA();
      window.GA_INITIALIZED = true;
    }

    // Enregistre la page visitée
    logPageView();
  }

  render() {
    const { Component, pageProps } = this.props;
    const { user } = pageProps;

    // Si le navigateur de l'utilisateur n'est pas supporté
    if (isIE) {
      return <Unsupported />;
    }

    return (
      <Layout id="layout" className={classnames({ layout__admin: user && user.isAdmin })}>
        <SWRConfig value={{ refreshInterval: 3000 }}>
          <DefaultSeo {...SEO} />
          <Header {...pageProps} />
          <Component {...pageProps} />
          <Footer />
          <BackTop style={{ right: 50 }} />
        </SWRConfig>
      </Layout>
    );
  }
}

export default CustomApp;
