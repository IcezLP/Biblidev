import React from 'react';
import { PageHeader, Typography, Button } from 'antd';
import Link from 'next/link';

const { memo } = React;
const { Paragraph } = Typography;

const Hero = () => (
  <PageHeader
    title="Proposer une ressource"
    extra={[
      <Button key="submit" type="primary">
        <Link href="/submit" as="/proposition">
          <a>Proposer une ressource</a>
        </Link>
      </Button>,
    ]}
  >
    <Paragraph>
      Ajoutez en quelques clics une ressource qui vous tient à cœur et partagez la à la communauté !
      Elle sera soumise et validée par nos équipes très rapidement !
    </Paragraph>
  </PageHeader>
);

export default memo(Hero);
