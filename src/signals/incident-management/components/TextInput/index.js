import React from 'react';
import PropTypes from 'prop-types';
import Label from '../Label';
import Caption from '../Caption';

import './style.scss';

export const TextInput = ({ name, caption, display, placeholder }) => {
  const render = ({ handler }) => (
    <div className="text-input">
      <div className="mode_input text rij_verplicht">
        <div className="text-input__label">
          <Label htmlFor={`form${name}`}>{display}</Label>
        </div>

        {caption && <Caption>{caption}</Caption>}

        <div className="text-input__control invoer">
          <input
            id={`form${name}`}
            className="input"
            type="text"
            {...handler()}
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );

  render.defaultProps = {
    touched: false,
    placeholder: '',
  };

  render.propTypes = {
    handler: PropTypes.func.isRequired,
  };
  return render;
};

export default TextInput;
