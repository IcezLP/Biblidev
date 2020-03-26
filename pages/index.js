import React from 'react';
import withAuth from '../middlewares/withAuth';
import fetch from '../lib/fetch';

export default withAuth(() => {
  const test = async () => {
    await fetch('post', '/api/users/test');
  };

  return <button onClick={test}>Test</button>;
});
