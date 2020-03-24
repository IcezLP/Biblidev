import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { DefaultSeo } from 'next-seo';
import SEO from '../next-seo.config';
import Navbar from '../components/layout/Navbar';

// NProgress config
NProgress.configure({ showSpinner: false });

// Router events
Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeError = () => NProgress.done();
Router.onRouteChangeComplete = () => NProgress.done();

class CustomApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <DefaultSeo {...SEO} />
        <header>
          <Navbar {...pageProps} />
        </header>
        <Component {...pageProps} />
      </>
    );
  }
}

export default CustomApp;
