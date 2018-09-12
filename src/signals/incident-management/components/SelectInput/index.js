/**
*
* SelectInput
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const SelectInput = (props) => {
  const { name, display, values, multiple, emptyOptionText, size } = props;
  const options = values.map(({ key, value }) =>
    <option key={key} title={key ? value : emptyOptionText || value} value={key}>{key ? value : emptyOptionText || value}</option>
  );
  const listSize = (values.length > size) ? size : values.length;

  const render = ({ handler }) => (
    <div className="select-input">
      <div className="mode_input text rij_verplicht">
        <div className="select-input__label">
          <label htmlFor={`form${name}`}>{display}</label>
        </div>

        <div className="select-input__control invoer">
          <select
            name=""
            id={`form${name}`}
            {...handler()}
            multiple={multiple}
            size={multiple ? listSize : ''}
          >
            {options}
          </select>
        </div>
      </div>
    </div>);

  render.defaultProps = {
    touched: false,
    size: 10
  };

  render.propTypes = {
    handler: PropTypes.func.isRequired
  };
  return render;
};


export default SelectInput;
