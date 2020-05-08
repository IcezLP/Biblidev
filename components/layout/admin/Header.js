import React from 'react';
import { PageHeader, Typography } from 'antd';

const { memo } = React;

const Header = ({ title, subTitle }) => (
  <PageHeader title={title} style={{ backgroundColor: 'white', marginBottom: 20, padding: 0 }}>
    {subTitle && <Typography.Paragraph>{subTitle}</Typography.Paragraph>}
  </PageHeader>
);

export default memo(Header);
