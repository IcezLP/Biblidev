import React from 'react';
import PropTypes from 'prop-types';

const InputGroup = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  type,
  error,
  disabled,
  isLoading,
}) => (
  <div className="form__group">
    <label htmlFor={name} className="form__label">
      {label}
    </label>
    <input
      id={name}
      name={name}
      className="form__input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={type}
      disabled={disabled || isLoading}
    />
    {error && <small>{error}</small>}
  </div>
);

InputGroup.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['text', 'password']),
  error: PropTypes.string,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
};

InputGroup.defaultProps = {
  placeholder: '',
  type: 'text',
  error: '',
  disabled: false,
  isLoading: false,
};

export default InputGroup;
