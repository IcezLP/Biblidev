import React from 'react';
import { PageHeader, Typography, Button } from 'antd';

export default ({ title, subTitle }) => (
  <PageHeader title={title} style={{ backgroundColor: 'white', marginBottom: 20, padding: 0 }}>
    {subTitle && <Typography.Paragraph>{subTitle}</Typography.Paragraph>}
  </PageHeader>
);
