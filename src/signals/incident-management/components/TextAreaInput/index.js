import React from 'react';
import PropTypes from 'prop-types';

import { FieldControl } from 'react-reactive-form';
import './style.scss';

export const TextAreaInput = ({ name, control, ...props }) => (
  <div className="text-area-input">
    <FieldControl name={name} control={control} render={TextAreaInputRender(props)} />
  </div>);

TextAreaInput.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired
};

export const TextAreaInputRender = (props) => {
  const { name, display, placeholder, rows } = props;
  const render = ({ handler }) => (<div>
    <div className="mode_input text rij_verplicht">
      <div className="label">
        <label htmlFor={`form${name}`}>{display}</label>
      </div>

      <div className="text-area-input__control invoer">
        <textarea
          name=""
          id={`form${name}`}
          value=""
          {...handler()}
          placeholder={placeholder}
          rows={rows}
        />
      </div>

    </div>
  </div>);

  render.defaultProps = {
    touched: false,
    placeholder: '',
    rows: 4
  };

  render.propTypes = {
    handler: PropTypes.func.isRequired,
  };
  return render;
};
