import React from 'react';
import PropTypes from 'prop-types';

import { FieldControl } from 'react-reactive-form';
import './style.scss';

const TextInput = (p) => {
  const { name, control } = p;

  return (
    <div>
      <FieldControl
        name={name}
        control={control}
        render={TextInputRender(name)}
      />
    </div>
  );
};

export const TextInputRender = (name) => {
  const render = ({ handler, touched, hasError }) => (<div>
    <div className="rij mode_input text rij_verplicht">
      <div className="label">
        <label htmlFor={`form${name}`}>{name}</label>
      </div>

      <div className="invoer">
        <input name="" id={`form${name}`} value="" className="input" type="text" {...handler()} />
      </div>
      <div>
        {touched
          && hasError('required')
          && 'Name is required'}
      </div>

    </div>
  </div>);

  render.propTypes = {
    handler: PropTypes.func.isRequired,
    hasError: PropTypes.func.isRequired,
    touched: PropTypes.boolean,
  };
  return render;
};

export default TextInput;
