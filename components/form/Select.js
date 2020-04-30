import React from 'react';
import { Select as AntdSelect, Form, Empty } from 'antd';
import PropTypes from 'prop-types';
import { kebabCase } from 'lodash';

/**
 * @param {String} label The label of input
 * @param {String} error Input error info
 * @param {String} placeholder The input placeholder
 * @param {Boolean} disabled Whether the input is disabled
 * @param {Boolean} allowClear Allow to remove input content with clear icon
 * @param {String} mode Set mode of Select
 * @param {Boolean} showArrow Whether to show the drop-down arrow
 * @param {Boolean} showSearch Whether show search input in single mode
 * @param {String} emptyMessage Message to show when there is no data
 * @param {Array} options The options to render
 * @param {String} size The size of the input box
 * @param {String} name Name of the input
 */
const Select = ({
  label,
  error,
  placeholder,
  disabled,
  allowClear,
  mode,
  showArrow,
  showSearch,
  emptyMessage,
  options,
  size,
  optionKey,
  optionLabel,
  value,
  onChange,
  name,
  ...props
}) => {
  const handleChange = (selected) => {
    const event = {
      target: {
        name,
        value: selected,
      },
    };

    return onChange(event);
  };

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
      <AntdSelect
        {...props}
        placeholder={placeholder}
        disabled={disabled}
        allowClear={allowClear}
        mode={mode}
        showArrow={showArrow}
        showSearch={showSearch}
        notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyMessage} />}
        size={size}
        value={value}
        onChange={handleChange}
        optionFilterProp="children"
        filterOption={(input, option) =>
          kebabCase(option.props.children).indexOf(kebabCase(input)) >= 0
        }
        style={{ width: '100%' }}
      >
        {options.map((option) => (
          <AntdSelect.Option key={option[optionKey]}>{option[optionLabel]}</AntdSelect.Option>
        ))}
      </AntdSelect>
    </Form.Item>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  allowClear: PropTypes.bool,
  mode: PropTypes.oneOf(['tags', 'default', 'multiple']),
  showArrow: PropTypes.bool,
  showSearch: PropTypes.bool,
  emptyMessage: PropTypes.string,
  size: PropTypes.oneOf(['small', 'default', 'large']),
  options: PropTypes.array.isRequired,
  optionKey: PropTypes.string.isRequired,
  optionLabel: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

Select.defaultProps = {
  label: '',
  error: '',
  placeholder: '',
  disabled: false,
  allowClear: false,
  mode: 'default',
  showArrow: true,
  showSearch: true,
  emptyMessage: 'Aucune donnée',
  size: 'default',
};

export default Select;
