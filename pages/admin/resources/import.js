import React from 'react';
import { Button, Alert, Typography, Row, Col, Form } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import withAuth from '../../../middlewares/withAuth';
import Layout from '../../../components/layout/admin/Layout';
import Upload from '../../../components/form/Upload';
import useForm from '../../../hooks/useForm';
import { notify } from '../../../lib/notification';

export default withAuth(
  () => {
    const { values, errors, handleChange, handleSubmit, isLoading } = useForm(
      () => notify('success', 'Importation réussie'),
      'post',
      '/api/admin/resources/import',
      true,
    );

    if (errors.message) {
      console.log(errors.message);
      notify('error', errors.message);
    }

    return (
      <Layout title="Importer des ressources">
        <Button
          download
          href="/import.xlsx"
          icon={<DownloadOutlined />}
          style={{ marginBottom: 20 }}
        >
          Télécharger le template
        </Button>

        <Row gutter={[12, 12]} type="flex">
          <Col sm={24} md={12}>
            <Alert
              showIcon
              type="info"
              message="Informations d'importation"
              description={
                <>
                  <Typography.Text>
                    L'importation est en phase de test et ne supporte pour le moment que les
                    fichiers au format .xlsx
                  </Typography.Text>
                  <br />
                  <Typography.Text>
                    L'upload de logo doit se faire après l'importation via la page « À valider »
                  </Typography.Text>
                  <br />
                  <Typography.Text>
                    Le fichier doit contenir 5 colonnes labellisées respectivement name,
                    description, categories, link, price
                  </Typography.Text>
                  <br />
                  <Typography.Text>
                    Les catégories doivent être l'id des catégories désirées et séparées par un
                    point virgule sans espace
                  </Typography.Text>
                </>
              }
            />
          </Col>
          <Col sm={24} md={12}>
            <Form noValidate onFinish={handleSubmit}>
              <Upload
                error={errors.import}
                name="import"
                disabled={isLoading}
                onChange={handleChange}
                value={values.import || {}}
                placeholder="Sélectionner ou déposer un fichier"
              />
              <Button block type="primary" htmlType="submit" loading={isLoading}>
                Débuter l'importation
              </Button>
            </Form>
          </Col>
        </Row>
        {errors.validation && (
          <Alert
            showIcon
            type="error"
            message={`${errors.validation.length} ligne${errors.validation.length > 1 ? 's' : ''} ${
              errors.validation.length > 1 ? 'contiennent' : 'contient'
            } une ou plusieurs erreurs`}
            description={errors.validation.map((object) => (
              <div key={object.position}>
                {/* eslint-disable-next-line */}
                <Typography.Text strong>Ligne {object.position}</Typography.Text>
                <br />
                {Object.entries(object).map((item) => {
                  if (item[0] !== 'position') {
                    return (
                      <div key={item[0]}>
                        <Typography.Text>{item[1]}</Typography.Text>
                        <br />
                      </div>
                    );
                  }
                })}
              </div>
            ))}
          />
        )}
      </Layout>
    );
  },
  { loginRequired: true, adminRequired: true },
);
