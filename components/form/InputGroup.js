import React from 'react';
import PropTypes from 'prop-types';

const InputGroup = ({ label, name, placeholder }) => (
  <div className="form__group">
    <label htmlFor={name} className="form__label">
      {label}
    </label>
    <input id={name} name={name} className="form__input" placeholder={placeholder} />
  </div>
);

InputGroup.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

InputGroup.defaultProps = {
  placeholder: '',
};

export default InputGroup;
