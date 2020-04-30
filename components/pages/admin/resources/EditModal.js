import React, { useState, useEffect } from 'react';
import { Modal, Form, Typography } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import useForm from '../../../../hooks/useForm';
import { notify } from '../../../../lib/notification';
import Input from '../../../form/Input';
import Radio from '../../../form/Radio';
import Select from '../../../form/Select';
import Upload from '../../../form/Upload';

export default ({ resource, trigger, mutate, categories, ...props }) => {
  const [visible, setVisible] = useState(false);

  const { values, errors, handleChange, handleSubmit, isLoading } = useForm(
    () => {
      setVisible(false);
      notify('success', 'La ressource a été mise à jour');
      mutate();
    },
    'put',
    `/api/admin/resources/${resource._id}`,
    true,
  );

  useEffect(() => {
    values.name = resource.name;
    values.description = resource.description;
    values.link = resource.link;
    values.price = resource.price;
    values.categories = resource.categories.map((category) => category._id);
  }, [resource, visible]);

  const prices = [
    { label: 'Gratuit', value: 'gratuit' },
    { label: 'Payant', value: 'payant' },
    { label: 'Gratuit ou payant', value: 'gratuit-et-payant' },
  ];

  return (
    <>
      {React.cloneElement(trigger, { ...props, onClick: () => setVisible(true) })}
      <Modal
        key={`edit-${resource._id}`}
        visible={visible}
        onCancel={() => setVisible(false)}
        title={`Modifier la ressource ${resource.name}`}
        maskStyle={{ zIndex: 1100 }}
        wrapClassName="modal__wrapper"
        onOk={handleSubmit}
        okText="Confirmer"
        confirmLoading={isLoading}
        cancelText="Annuler"
      >
        <Form noValidate onFinish={handleSubmit}>
          <Upload
            label="Logo"
            error={errors.logo}
            name="logo"
            disabled={isLoading}
            onChange={handleChange}
            value={values.logo || {}}
            placeholder="Sélectionner ou déposer une image"
            current={
              resource.logo && `https://res.cloudinary.com/biblidev/image/upload/${resource.logo}`
            }
          />
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
            dropdownStyle={{ zIndex: 1200 }}
          />
          <Input
            name="link"
            value={values.link || ''}
            onChange={handleChange}
            error={errors.link}
            placeholder="Site web"
            label="Site web"
            disabled={isLoading}
            suffix={
              <a href={values.link || ''} target="_blank" rel="noopener noreferrer">
                <LinkOutlined />
              </a>
            }
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
        </Form>
      </Modal>
    </>
  );
};
