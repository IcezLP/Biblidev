import React from 'react';
import { Form, Row, Col, Button, Typography, Alert } from 'antd';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Input from '../../components/form/Input';
import useForm from '../../hooks/useForm';
import { notify } from '../../lib/notification';
import withAuth from '../../middlewares/withAuth';

const Reset = ({ token }) => {
  const { values, errors, isLoading, handleChange, handleSubmit } = useForm(
    () => notify('success', 'Votre mot de passe a bien été modifié'),
    'post',
    `/api/auth/reset/${token}`,
  );

  return (
    <>
      <NextSeo title="Nouveau mot de passe" />
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
                <Typography.Title level={2}>Modifier mon mot de passe</Typography.Title>
              </div>
              {errors.message && <Alert type="error" showIcon message={errors.message} />}
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
                Confirmer
              </Button>
            </Form>
          </section>
        </Col>
      </Row>
    </>
  );
};

Reset.getInitialProps = ({ query }) => {
  return { token: query.token };
};

export default withAuth(Reset, { logoutRequired: true });
