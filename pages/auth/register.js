import React from 'react';
import Link from 'next/link';
import { Form, Row, Col, Button, Typography, Alert } from 'antd';
import { NextSeo } from 'next-seo';
import { MailOutlined, ArrowLeftOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import Input from '../../components/form/Input';
import useForm from '../../hooks/useForm';
import { notify } from '../../lib/notification';
import withAuth from '../../middlewares/withAuth';

export default withAuth(
  () => {
    const { values, errors, isLoading, handleChange, handleSubmit } = useForm(
      () => notify('success', 'Inscription réussie, un email de confirmation vous a été envoyé'),
      'post',
      '/api/auth/register',
    );

    return (
      <>
        <NextSeo title="Inscription" />
        <Row type="flex" justify="center">
          <Col xs={24} sm={16} md={12} lg={10} xl={8} xxl={6}>
            <section style={{ border: '1px solid #ebedf0', margin: 20, borderRadius: 4 }}>
              <div style={{ borderBottom: '1px solid #ebedf0', padding: 10 }}>
                <Link href="/auth/login" as="/connexion">
                  <a>
                    <ArrowLeftOutlined style={{ marginRight: 5 }} />
                    Retour à la page de connexion
                  </a>
                </Link>
              </div>
              <Form onFinish={handleSubmit} noValidate style={{ padding: 10 }}>
                <div style={{ textAlign: 'center' }}>
                  <Typography.Title level={2}>Inscription</Typography.Title>
                </div>
                {errors.message && <Alert type="error" showIcon message={errors.message} />}
                <Input
                  placeholder="Nom d'utilisateur"
                  value={values.username || ''}
                  onChange={handleChange}
                  label="Nom d'utilisateur"
                  name="username"
                  error={errors.username}
                  disabled={isLoading}
                  icon={<UserOutlined />}
                  maxLength={20}
                />
                <Input
                  placeholder="Adresse mail"
                  value={values.email || ''}
                  onChange={handleChange}
                  label="Adresse mail"
                  name="email"
                  error={errors.email}
                  disabled={isLoading}
                  type="email"
                  icon={<MailOutlined />}
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
                <Input
                  placeholder="Confirmation du mot de passe"
                  value={values.confirm || ''}
                  onChange={handleChange}
                  label="Confirmation du mot de passe"
                  name="confirm"
                  password
                  error={errors.confirm}
                  disabled={isLoading}
                  icon={<LockOutlined />}
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ margin: '20px 0' }}
                  loading={isLoading}
                  block
                >
                  Inscription
                </Button>
              </Form>
            </section>
          </Col>
        </Row>
      </>
    );
  },
  { logoutRequired: true },
);
