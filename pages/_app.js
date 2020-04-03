import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { DefaultSeo } from 'next-seo';
import { Layout, BackTop } from 'antd';
import classnames from 'classnames';
import SEO from '../next-seo.config';
import Header from '../components/layout/Header';

// NProgress config
NProgress.configure({ showSpinner: false });

// Router events
Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeError = () => NProgress.done();
Router.onRouteChangeComplete = () => NProgress.done();

class CustomApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const { user } = pageProps;

    return (
      <Layout id="layout" className={classnames({ layout__admin: user && user.isAdmin })}>
        <DefaultSeo {...SEO} />
        <Header {...pageProps} />
        <Component {...pageProps} />
        <BackTop style={{ right: 50 }} />
      </Layout>
    );
  }
}

export default CustomApp;
