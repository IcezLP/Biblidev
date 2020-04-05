import React from 'react';
import withAuth from '../middlewares/withAuth';

export default withAuth(() => <div>Maintenance en cours</div>);
