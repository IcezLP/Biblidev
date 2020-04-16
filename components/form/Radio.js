import React from 'react';
import { Radio as AntdRadio, Form } from 'antd';
import PropTypes from 'prop-types';

/**
 * @param {String} label The label of input
 * @param {String} error Input error info
 * @param {String} value The selected value
 * @param {Function} onChange The radio group change event
 * @param {Array} options The options to render
 * @param {string} name The radio group name
 * @param {Boolean} disabled Whether the input is disabled
 */
const Radio = ({ label, error, options, value, onChange, name, disabled }) => (
  <Form.Item
    label={label}
    labelAlign="left"
    labelCol={{ sm: 24 }}
    validateStatus={error && 'error'}
    help={!!error && error}
    style={{ marginBottom: 0 }}
  >
    <AntdRadio.Group
      options={options}
      value={value}
      onChange={onChange}
      name={name}
      disabled={disabled}
    />
  </Form.Item>
);

Radio.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

Radio.defaultProps = {
  label: '',
  error: '',
  disabled: false,
};

export default Radio;
