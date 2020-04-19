import React from 'react';
import { Input as AntdInput, Icon, Form, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { InfoCircleOutlined } from '@ant-design/icons';

/**
 * @param {String} placeholder The input placeholder
 * @param {String} icon The prefix icon for the Input
 * @param {Boolean} password Enable the hide/show button
 * @param {String} type The type of input
 * @param {Boolean} disabled Whether the input is disabled
 * @param {Boolean} textarea Transform input to a textarea
 * @param {Boolean} clear Allow to remove input content with clear icon
 * @param {Boolean|Object} autoSize Height autosize feature, only for textarea
 * @param {String} value The input value
 * @param {Function} onChange The input change event
 * @param {Boolean} search Add a search button
 * @param {Boolean} loading Add a loading suffix
 * @param {Function} onSearch Event triggered when clicked on the search button
 * @param {String} size The size of the input box
 * @param {Number} maxLength Max length value
 * @param {String|Object} tooltip Information text
 * @param {Boolean} enterButton Whether or not to show a enter button on a search input
 * @param {String} label The label of input
 * @param {String} name Name of the input
 * @param {String} error Input error info
 */
const Input = ({
  placeholder,
  icon,
  password,
  type,
  disabled,
  textarea,
  clear,
  autoSize,
  value,
  onChange,
  search,
  loading,
  onSearch,
  size,
  maxLength,
  tooltip,
  enterButton,
  label,
  name,
  error,
  suffix,
}) => {
  const InputType = password
    ? AntdInput.Password
    : textarea
    ? AntdInput.TextArea
    : search
    ? AntdInput.Search
    : AntdInput;

  const textareaConfig = textarea ? { autoSize } : {};
  const searchConfig = search ? { onSearch, enterButton, loading } : {};
  return (
    <Form.Item
      label={label}
      labelAlign="left"
      labelCol={{ sm: 24 }}
      hasFeedback={!!error}
      validateStatus={error && 'error'}
      help={!!error && error}
      style={{ marginBottom: 0 }}
    >
      <InputType
        placeholder={placeholder}
        prefix={icon}
        suffix={
          suffix ||
          (tooltip && (
            <Tooltip title={tooltip}>
              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
          ))
        }
        type={password ? 'password' : type}
        name={name}
        disabled={loading || disabled}
        allowClear={clear}
        value={value}
        onChange={onChange}
        size={size}
        maxLength={maxLength}
        {...searchConfig}
        {...textareaConfig}
      />
    </Form.Item>
  );
};

Input.propTypes = {
  placeholder: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  password: PropTypes.bool,
  type: PropTypes.oneOf(['text', 'password', 'email']),
  disabled: PropTypes.bool,
  textarea: PropTypes.bool,
  clear: PropTypes.bool,
  autoSize: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  search: PropTypes.bool,
  loading: PropTypes.bool,
  onSearch: PropTypes.func,
  size: PropTypes.oneOf(['small', 'default', 'large']),
  maxLength: PropTypes.number,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  enterButton: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
};

Input.defaultProps = {
  placeholder: '',
  icon: '',
  password: false,
  type: 'text',
  disabled: false,
  textarea: false,
  clear: false,
  autoSize: false,
  search: false,
  loading: false,
  onSearch: () => {},
  size: 'default',
  maxLength: Infinity,
  tooltip: '',
  enterButton: true,
  label: '',
  error: '',
};

export default Input;
