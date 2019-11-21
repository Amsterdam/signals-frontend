import React from 'react';
import PropTypes from 'prop-types';
import { Input } from '@datapunt/asc-ui';
import Label from 'components/Label';

import './style.scss';

const TextInput = ({ name, display, placeholder }) => {
  const Render = ({ handler }) => (
    <div>
      <Label htmlFor={`form${name}`}>{display}</Label>

      <Input
        name={name}
        data-testid={name}
        id={`form${name}`}
        type="text"
        {...handler()}
        placeholder={placeholder}
      />
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
