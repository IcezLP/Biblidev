import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class CustomDocument extends Document {
  render() {
    return (
      <Html lang="fr">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="google" content="notranslate" />
          <meta name="theme-color" content="#17499f" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="/images/favicons/mstile-144x144.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/images/favicons/favicon.ico" />
          <link rel="icon" type="image/png" sizes="16x16" href="/images/favicons/16x16.png" />
          <link rel="icon" type="image/png" sizes="24x24" href="/images/favicons/24x24.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/images/favicons/32x32.png" />
          <link rel="icon" type="image/png" sizes="48x48" href="/images/favicons/48x48.png" />
          <link rel="icon" type="image/png" sizes="64x64" href="/images/favicons/64x64.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/images/favicons/96x96.png" />
          <link rel="icon" type="image/png" sizes="180x180" href="/images/favicons/180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/images/favicons/192x192.png" />
          <link rel="icon" type="image/png" sizes="196x196" href="/images/favicons/196x196.png" />
          <link rel="icon" type="image/png" sizes="228x228" href="/images/favicons/228x228.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="/images/favicons/512x512.png" />
          <link rel="apple-touch-icon" sizes="57x57" href="/images/favicons/apple-touch-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/images/favicons/apple-touch-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/images/favicons/apple-touch-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/images/favicons/apple-touch-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/images/favicons/apple-touch-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/images/favicons/apple-touch-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/images/favicons/apple-touch-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/images/favicons/apple-touch-icon-152x152.png" />
          <link rel="stylesheet" href="/css/main.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
