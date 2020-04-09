import { Result } from 'antd';
import { NextSeo } from 'next-seo';

export default () => (
  <>
    <NextSeo title="Page introuvable" />
    <Result status="404" subTitle="La page demandée est introuvable (404)" />
  </>
);
