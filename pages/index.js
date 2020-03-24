import React from 'react';
import Axios from 'axios';

export default () => {
  const request = async () => {
    try {
      const response = await Axios.post('/api/auth/login');
      console.log(response);
    } catch (error) {
      console.log(error.response);
    }
  };
  return (
    <button type="button" onClick={request}>
      Request
    </button>
  );
};
