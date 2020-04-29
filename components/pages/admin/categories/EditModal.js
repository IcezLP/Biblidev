import React, { useState, useEffect } from 'react';
import { Modal, Form, Menu } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import Input from '../../../form/Input';
import useForm from '../../../../hooks/useForm';
import { notify } from '../../../../lib/notification';

export default ({ record, handleDelete, mutate, ...props }) => {
  const [visible, setVisible] = useState(false);

  const { values, errors, handleChange, handleSubmit, isLoading } = useForm(
    () => {
      setVisible(false);
      notify('success', 'La catégorie a été mise à jour');
      mutate();
    },
    'put',
    `/api/admin/categories/${record._id}`,
  );

  useEffect(() => {
    values.name = record.name;
    values.plural_name = record.plural_name;
  }, [record]);

  return (
    <>
      <Menu.Item key="edit" {...props} onClick={() => setVisible(true)}>
        <EditOutlined />
        Éditer
      </Menu.Item>
      <Modal
        key={`edit_${record._id}`}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleSubmit}
        okText="Confirmer"
        confirmLoading={isLoading}
        title="Modifier une catégorie"
        maskStyle={{ zIndex: 1100 }}
        wrapClassName="modal__wrapper"
      >
        <Form noValidate onFinish={handleSubmit}>
          <Input
            name="name"
            value={values.name || ''}
            onChange={handleChange}
            error={errors.name}
            placeholder="Nom"
            label="Nom"
            disabled={isLoading}
            maxLength={30}
          />
          <Input
            name="plural_name"
            value={values.plural_name || ''}
            onChange={handleChange}
            error={errors.plural_name}
            placeholder="Pluriel (optionnel)"
            label="Pluriel (optionnel)"
            disabled={isLoading}
            maxLength={35}
          />
        </Form>
      </Modal>
    </>
  );
};
