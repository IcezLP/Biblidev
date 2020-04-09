import React from 'react';
import withAuth from '../middlewares/withAuth';
import Error from '../components/Error';

export default withAuth(() => <Error />);
