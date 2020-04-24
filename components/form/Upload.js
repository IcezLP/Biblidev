import React, { useEffect, useState } from 'react';
import { Upload as AntdUpload, Form } from 'antd';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';

/**
 * @param {String} label The label of input
 * @param {String} error Input error info
 * @param {String} name Name of the input
 * @param {Boolean} disabled Whether the input is disabled
 * @param {Function} onChange The input change event
 * @param {Object} value The file object, used to generate a preview
 */
const Upload = ({ label, error, name, disabled, onChange, value, placeholder }) => {
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    if (value instanceof File) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setFileUrl(reader.result));
      reader.readAsDataURL(value);
    } else {
      setFileUrl('');
    }
  }, [value]);

  const handleChange = ({ file }) => {
    const event = {
      target: {
        name,
        value: file.originFileObj,
      },
    };

    return onChange(event);
  };

  return (
    <Form.Item
      label={label}
      labelAlign="left"
      labelCol={{ sm: 24 }}
      validateStatus={error && 'error'}
      help={!!error && error}
      style={{ marginBottom: 0 }}
    >
      <AntdUpload
        name={name}
        disabled={disabled}
        showUploadList={false}
        listType="picture-card"
        onChange={handleChange}
      >
        {fileUrl ? (
          <img
            src={fileUrl}
            alt={value.name ? value.name : label}
            style={{ maxWidth: '100%', maxHeight: '160px' }}
          />
        ) : (
          <>
            <PlusOutlined />
            <div className="ant-upload-text">{placeholder}</div>
          </>
        )}
      </AntdUpload>
    </Form.Item>
  );
};

Upload.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired,
};

Upload.defaultProps = {
  label: '',
  error: '',
  disabled: false,
};

export default Upload;
