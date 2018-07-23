import React from 'react';
import PropTypes from 'prop-types';

import { FieldControl } from 'react-reactive-form';
// import withFieldControl from '../FieldControlWrapper';
import './style.scss';


export const TextInput = ({ name, control, ...props }) => (
  <div>
    <FieldControl name={name} control={control} render={TextInputRender(props)} />
  </div>);

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired
};


export const TextInputRender = (props) => {
  const { name, display, placeholder } = props;
  const render = ({ handler }) => (<div>
    <div className="mode_input text rij_verplicht">
      <div className="label">
        <label htmlFor={`form${name}`}>{display}</label>
      </div>

      <div className="invoer">
        <input name="" id={`form${name}`} value="" className="input" type="text" {...handler()} placeholder={placeholder} />
      </div>

    </div>
  </div>);

  render.defaultProps = {
    touched: false,
    placeholder: ''
  };

  render.propTypes = {
    handler: PropTypes.func.isRequired,
  };
  return render;
};

