import React, { useEffect } from 'react';
import { Row, Col, Form, Button, Alert, Typography } from 'antd';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Input from '../components/form/Input';
import Radio from '../components/form/Radio';
import Select from '../components/form/Select';
import Upload from '../components/form/Upload';
import useForm from '../hooks/useForm';
import { notify } from '../lib/notification';
import withAuth from '../middlewares/withAuth';
import fetch from '../lib/fetch';

const Submit = ({ user, categories }) => {
  const { values, errors, handleChange, handleSubmit, isLoading } = useForm(
    () => notify('success', 'Proposition réussie'),
    'post',
    '/api/resources/submit',
    true,
  );

  useEffect(() => {
    if (user && !values.user) {
      values.user = user._id;
    }
  }, [values]);

  const prices = [
    { label: 'Gratuit', value: 'gratuit' },
    { label: 'Payant', value: 'payant' },
    { label: 'Gratuit ou payant', value: 'gratuit-et-payant' },
  ];

  return (
    <>
      <NextSeo title="Proposer une ressource" />
      <Row type="flex" justify="center">
        <Col xs={24} sm={16} md={12} lg={10} xl={8} xxl={6}>
          <section style={{ border: '1px solid #ebedf0', margin: 20, borderRadius: 4 }}>
            <Form onFinish={handleSubmit} noValidate style={{ padding: 10 }}>
              {!user && (
                <Alert
                  type="info"
                  showIcon
                  banner
                  message={
                    <>
                      En vous connectant les ressources que vous proposez apparaissent sur votre
                      profil et portent votre nom. &nbsp;
                      <br />
                      <Link href="/signin">
                        <a>Me connecter</a>
                      </Link>
                    </>
                  }
                  style={{ marginBottom: errors.message && '10px' }}
                />
              )}
              {errors.message && <Alert type="error" showIcon message={errors.message} />}
              <Upload
                label="Logo"
                error={errors.logo}
                name="logo"
                disabled={isLoading}
                onChange={handleChange}
                value={values.logo || {}}
              />
              <Input
                name="name"
                value={values.name || ''}
                onChange={handleChange}
                error={errors.name}
                placeholder="Nom"
                label="Nom"
                disabled={isLoading}
                maxLength={24}
              />
              <Input
                name="description"
                value={values.description || ''}
                onChange={handleChange}
                error={errors.description}
                placeholder="Description"
                label="Description"
                disabled={isLoading}
                suffix={
                  <Typography.Text type="secondary">
                    {(values.description && values.description.length) || '0'}
                  </Typography.Text>
                }
                maxLength={160}
              />
              <Select
                label="Catégorie(s)"
                error={errors.categories}
                placeholder="Catégorie(s)"
                disabled={isLoading}
                allowClear
                mode="multiple"
                options={categories}
                optionKey="_id"
                optionLabel="name"
                value={values.categories || []}
                onChange={handleChange}
                name="categories"
                maxLength={5}
              />
              <Input
                name="link"
                value={values.link || ''}
                onChange={handleChange}
                error={errors.link}
                placeholder="Site web"
                label="Site web"
                disabled={isLoading}
              />
              <Radio
                label="Prix"
                error={errors.price}
                options={prices}
                value={values.price || ''}
                onChange={handleChange}
                name="price"
                disabled={isLoading}
              />
              <Button
                type="primary"
                htmlType="submit"
                style={{ margin: '20px 0' }}
                loading={isLoading}
                block
              >
                Proposition
              </Button>
            </Form>
          </section>
        </Col>
      </Row>
    </>
  );
};

Submit.getInitialProps = async () => {
  const response = await fetch('get', '/api/categories');
  return { categories: response.data.categories };
};

export default withAuth(Submit);
