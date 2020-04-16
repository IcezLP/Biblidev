import React from 'react';
import Link from 'next/link';
import cookies from 'js-cookie';
import Router from 'next/router';
import { NextSeo } from 'next-seo';
import { Form, Row, Col, Button, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons';
import Input from '../../components/form/Input';
import useForm from '../../hooks/useForm';
import withAuth from '../../middlewares/withAuth';
import fetch from '../../lib/fetch';
import { notify } from '../../lib/notification';

export default withAuth(
  () => {
    // Connexion
    const setAuthToken = (data) => {
      // Enregistre le token de connexion
      cookies.set('auth', data.token);
      // Redirige sur la page d'accueil
      Router.push('/');
    };

    const { values, errors, isLoading, handleChange, handleSubmit, data } = useForm(
      setAuthToken,
      'post',
      '/api/auth/login',
    );

    const resendVerify = async () => {
      const response = await fetch('post', `/api/auth/resend/${data.userId}`);

      if (response.status === 'success') {
        notify('success', 'Un nouvel email de confirmation vous a été envoyé, vérifiez vos spams');
      }
    };

    return (
      <>
        <NextSeo title="Connexion" />
        <Row type="flex" justify="center">
          <Col xs={24} sm={16} md={12} lg={10} xl={8} xxl={6}>
            <section style={{ border: '1px solid #ebedf0', margin: 20, borderRadius: 4 }}>
              <Form onFinish={handleSubmit} noValidate style={{ padding: 10 }}>
                <div style={{ textAlign: 'center' }}>
                  <Typography.Title level={2}>Connexion</Typography.Title>
                </div>
                {errors.message && (
                  <Alert
                    type="error"
                    showIcon
                    message={
                      data.userId ? (
                        <>
                          {errors.message}
                          &nbsp;
                          <br />
                          <a href="#" onClick={resendVerify} id="resend">
                            Me renvoyer un email de validation
                          </a>
                        </>
                      ) : (
                        errors.message
                      )
                    }
                  />
                )}
                <Input
                  placeholder="Adresse mail"
                  value={values.email || ''}
                  onChange={handleChange}
                  label="Adresse mail"
                  name="email"
                  error={errors.email}
                  disabled={isLoading}
                  type="email"
                  icon={<UserOutlined />}
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
                  icon={<LockOutlined />}
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
                    <ArrowRightOutlined style={{ marginLeft: 5 }} />
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
