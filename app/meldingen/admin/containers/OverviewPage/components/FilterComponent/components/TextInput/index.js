import React from 'react';
import PropTypes from 'prop-types';

import { FieldControl } from 'react-reactive-form';

import './style.scss';

const TextInput = ({ name }) => (
  <FieldControl name={name} render={TextInputRender} />
);

TextInput.propTypes = {
  name: PropTypes.string
};

const TextInputRender = ({ handler, touched, hasError }) => (
  <div>
    <div className="rij mode_input text rij_verplicht">
      <div className="label">
        <label htmlFor="formInput">Id</label>
      </div>

      <div className="invoer">
        <input name="" id="formInput" value="" className="input" type="text" {...handler()} />
      </div>
      <div>
        {touched
          && hasError('required')
          && 'Id is required'}
      </div>

    </div>
  </div>
);

TextInputRender.propTypes = {
  handler: PropTypes.func.isRequired,
  touched: PropTypes.boolean,
  hasError: PropTypes.func.isRequired,
};

export default TextInput;
