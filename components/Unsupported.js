import React from 'react';
import Logo from '../public/images/logo_inline.svg';
import Firefox from '../public/images/browsers/firefox.svg';
import Chrome from '../public/images/browsers/chrome.svg';

const Unsupported = () => (
  <div className="browser-unsupported" style={{ margin: 10, textAlign: 'center' }}>
    <div style={{ maxWidth: 200, textAlign: 'center', margin: '0 auto', maxHeight: 60 }}>
      <Logo />
    </div>
    <h1>Ce navigateur n'est pas pris en charge.</h1>
    <p>Pour utiliser Biblidev veuillez utiliser un navigateur supporté, nous vous recommandons :</p>
    <div style={{ margin: '0 auto', textAlign: 'center' }}>
      <a
        href="https://www.mozilla.org/fr/firefox/new/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          maxWidth: 70,
          textAlign: 'center',
          display: 'inline-block',
          margin: '5px 10px',
        }}
      >
        <Firefox />
        <span style={{ display: 'block' }}>Firefox</span>
      </a>
      <a
        href="https://www.google.com/intl/fr_fr/chrome/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          maxWidth: 70,
          textAlign: 'center',
          display: 'inline-block',
          margin: '5px 10px',
        }}
      >
        <Chrome />
        <span style={{ display: 'block' }}>Chrome</span>
      </a>
    </div>
  </div>
);

export default Unsupported;
