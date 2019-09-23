import React from 'react';
import PropTypes from 'prop-types';
import Label from '../Label';

import './style.scss';

const TextInput = ({ name, display, placeholder }) => {
  const Render = ({ handler }) => (
    <div className="text-input invoer">
      <Label htmlFor={`form${name}`}>{display}</Label>

      <input id={`form${name}`} className="input" type="text" {...handler()} placeholder={placeholder} />
    </div>
  );

  Render.defaultProps = {
    touched: false,
  };

  Render.propTypes = {
    handler: PropTypes.func.isRequired,
    touched: PropTypes.bool,
  };

  return Render;
};

TextInput.defaultProps = {
  placeholder: '',
};

TextInput.propTypes = {
  placeholder: PropTypes.string,
};

export default TextInput;
