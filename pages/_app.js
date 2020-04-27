import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { DefaultSeo } from 'next-seo';
import { Layout, BackTop } from 'antd';
import classnames from 'classnames';
import { SWRConfig } from 'swr';
import SEO from '../next-seo.config';
import Header from '../components/layout/Header';
import { initGA, logPageView } from '../services/google-analytics';

// NProgress config
NProgress.configure({ showSpinner: false });

// Router events
Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeError = () => NProgress.done();
Router.onRouteChangeComplete = () => {
  NProgress.done();
  logPageView();
};

class CustomApp extends App {
  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }

  render() {
    const { Component, pageProps } = this.props;
    const { user } = pageProps;

    return (
      <Layout id="layout" className={classnames({ layout__admin: user && user.isAdmin })}>
        <SWRConfig value={{ refreshInterval: 3000 }}>
          <DefaultSeo {...SEO} />
          <Header {...pageProps} />
          <Component {...pageProps} />
          <BackTop style={{ right: 50 }} />
        </SWRConfig>
      </Layout>
    );
  }
}

export default CustomApp;
