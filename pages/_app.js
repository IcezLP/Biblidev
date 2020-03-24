import React from 'react';
import App from 'next/app';
import Navbar from '../components/layout/Navbar';

class CustomApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <header>
          <Navbar {...pageProps} />
        </header>
        <Component {...pageProps} />
      </>
    );
  }
}

export default CustomApp;
