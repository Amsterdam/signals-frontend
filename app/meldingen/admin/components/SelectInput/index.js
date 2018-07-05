/**
*
* SelectInput
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import { FieldControl } from 'react-reactive-form';
import './style.scss';

export const SelectInput = ({ name, control, ...rest }) => (
  <div className="select-input">
    <FieldControl name={name} control={control} render={SelectInputRender(rest)} />
  </div>);

SelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired
};

export const SelectInputRender = (props) => {
  const { name, display, values } = props;
  const options = values.map(({ key, value }) =>
    <option key={key} value={key}>{value}</option>
  );

  const render = ({ handler }) => (<div>
    <div className="row mode_input text rij_verplicht">
      <div className="label">
        <label htmlFor={`form${name}`}>{display}</label>
      </div>

      <div className="invoer">
        <select name="" id={`form${name}`} {...handler()}>
          {options}
        </select>
      </div>
    </div>
  </div>);

  render.defaultProps = {
    touched: false
  };

  render.propTypes = {
    handler: PropTypes.func.isRequired
  };
  return render;
};


export default SelectInput;
