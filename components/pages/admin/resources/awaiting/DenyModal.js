import React, { useState } from 'react';
import { Modal, Button, Form } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { notify } from '../../../../../lib/notification';
import Select from '../../../../form/Select';
import useForm from '../../../../../hooks/useForm';
import Input from '../../../../form/Input';

export default ({ name, id, mutate }) => {
  const [visible, setVisible] = useState(false);

  const { values, errors, handleChange, handleSubmit, isLoading } = useForm(
    () => {
      setVisible(false);
      notify('success', 'La ressource a été refusée');
      mutate();
    },
    'put',
    `/api/admin/resources/deny/${id}`,
  );

  const options = [
    {
      label: 'La ressource existe déjà',
      value: 'exist',
    },
    {
      label: 'La ressource ne respecte pas les règles',
      value: 'rules',
    },
    {
      label: 'Autre (préciser)',
      value: 'custom',
    },
  ];

  return (
    <>
      <Button
        className="control__button"
        type="primary"
        danger
        icon={<CloseOutlined />}
        onClick={() => setVisible(true)}
      >
        Refuser
      </Button>
      <Modal
        key={`deny-${id}`}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleSubmit}
        cancelText="Annuler"
        okText="Confirmer"
        confirmLoading={isLoading}
        title={`Refuser la ressource ${name}`}
      >
        <Form noValidate onFinish={handleSubmit}>
          <Select
            label="Raison du refus"
            options={options}
            optionKey="value"
            optionLabel="label"
            onChange={handleChange}
            value={values.reason || ''}
            name="reason"
            disabled={isLoading}
            showSearch={false}
            error={errors.reason}
          />
          {values.reason === 'custom' ? (
            <Input
              name="custom"
              value={values.custom || ''}
              onChange={handleChange}
              error={errors.custom}
              label="Raison personnalisé"
              disabled={isLoading}
            />
          ) : null}
        </Form>
      </Modal>
    </>
  );
};
