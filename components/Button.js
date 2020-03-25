import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const Button = ({ children, block, type, blue }) => (
  <button
    className={classnames('button', { 'button--block': block, 'button--blue': blue })}
    type={type}
  >
    {children}
  </button>
);

Button.propTypes = {
  block: PropTypes.bool,
  type: PropTypes.string,
  blue: PropTypes.bool,
};

Button.defaultProps = {
  block: false,
  type: 'button',
  blue: false,
};

export default Button;
