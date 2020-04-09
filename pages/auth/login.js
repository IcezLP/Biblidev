import React from 'react';
import Link from 'next/link';
import cookies from 'js-cookie';
import Router from 'next/router';
import { NextSeo } from 'next-seo';
import { Form, Row, Col, Button, Typography, Icon, Alert } from 'antd';
import Input from '../../components/form/Input';
import useForm from '../../hooks/useForm';
import withAuth from '../../middlewares/withAuth';

export default withAuth(
  () => {
    // Connexion
    const setAuthToken = (data) => {
      // Enregistre le token de connexion
      cookies.set('auth', data.token);
      // Redirige sur la page d'accueil
      Router.push('/');
    };

    const { values, errors, isLoading, handleChange, handleSubmit } = useForm(
      setAuthToken,
      'post',
      '/api/auth/login',
    );

    return (
      <>
        <NextSeo title="Connexion" />
        <Row type="flex" justify="center">
          <Col xs={24} sm={16} md={12} lg={10} xl={8} xxl={6}>
            <section style={{ border: '1px solid #ebedf0', margin: 20, borderRadius: 4 }}>
              <Form onSubmit={handleSubmit} noValidate style={{ padding: 10 }}>
                <div style={{ textAlign: 'center' }}>
                  <Typography.Title level={2}>Connexion</Typography.Title>
                </div>
                {errors.message && <Alert type="error" showIcon message={errors.message} />}
                <Input
                  placeholder="Adresse mail"
                  value={values.email || ''}
                  onChange={handleChange}
                  label="Adresse mail"
                  name="email"
                  error={errors.email}
                  disabled={isLoading}
                  type="email"
                  icon="mail"
                />
                <Input
                  placeholder="Mot de passe"
                  value={values.password || ''}
                  onChange={handleChange}
                  label="Mot de passe"
                  name="password"
                  password
                  error={errors.password}
                  disabled={isLoading}
                  icon="lock"
                />
                <Form.Item style={{ margin: 0, textAlign: 'right' }}>
                  <Link href="/auth/forgot" as="/mot-de-passe-oublie">
                    <a>Mot de passe oublié ?</a>
                  </Link>
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ margin: '20px 0' }}
                  loading={isLoading}
                  block
                >
                  Connexion
                </Button>
              </Form>
              <div style={{ borderTop: '1px solid #ebedf0', padding: 10, textAlign: 'right' }}>
                <Link href="/auth/register" as="/inscription">
                  <a>
                    Pas encore inscrit ?
                    <Icon type="arrow-right" style={{ marginLeft: 5 }} />
                  </a>
                </Link>
              </div>
            </section>
          </Col>
        </Row>
      </>
    );
  },
  { logoutRequired: true },
);
