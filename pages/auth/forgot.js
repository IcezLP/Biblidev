import React from 'react';
import { Form, Row, Col, Button, Typography, Alert } from 'antd';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Input from '../../components/form/Input';
import useForm from '../../hooks/useForm';
import { notify } from '../../lib/notification';
import withAuth from '../../middlewares/withAuth';

export default withAuth(
  () => {
    const { values, errors, isLoading, handleChange, handleSubmit } = useForm(
      () =>
        notify(
          'success',
          "Si l'adresse mail saisie est correcte vous recevrez un email de réinitialisation",
        ),
      'post',
      '/api/auth/forgot',
    );

    return (
      <>
        <NextSeo title="Mot de passe oublié" />
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
                  <Typography.Title level={2}>Mot de passe oublié</Typography.Title>
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
                  icon={<MailOutlined />}
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ margin: '20px 0' }}
                  loading={isLoading}
                  block
                >
                  Réinitialiser mon mot de passe
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
