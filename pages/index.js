import React from 'react';
import { Result } from 'antd';
import withAuth from '../middlewares/withAuth';

export default withAuth(() => <Result title="Maintenance en cours" />);
