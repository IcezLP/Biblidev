import React from 'react';
import { PageHeader, Typography, Button } from 'antd';
import Link from 'next/link';

export default () => (
  <PageHeader
    title="Proposer une ressource"
    style={{ backgroundColor: 'white', marginBottom: 20 }}
    extra={[
      <Button key="submit" type="primary">
        <Link href="/submit" as="/proposition">
          <a>Proposer une ressource</a>
        </Link>
      </Button>,
    ]}
  >
    <Typography.Paragraph>
      Ajoutez en quelques clics une ressource qui vous tient à cœur et partagez la à la communauté !
      Elle sera soumise et validée par nos équipes très rapidement !
    </Typography.Paragraph>
  </PageHeader>
);
