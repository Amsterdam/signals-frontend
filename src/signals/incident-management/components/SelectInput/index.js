import React from 'react';
import PropTypes from 'prop-types';

import Label from 'components/Label';

import './style.scss';

export const SelectInput = ({
  name,
  display,
  values,
  multiple,
  emptyOptionText,
  size,
}) => {
  const options = values.map(
    ({ name: value, _links: { self: { public: key } = {} } = {} }) => (
      <option key={key || value} value={key || value}>
        {value}
      </option>
    )
  );

  const listSize = values.length > size ? size : values.length;

  const Render = ({ handler }) => (
    <div className="select-input">
      <div className="mode_input text rij_verplicht">
        {display && <Label htmlFor={`form${name}`}>{display}</Label>}

        <div className="select-input__control invoer">
          <select
            name={name}
            data-testid={name}
            id={`form${name}`}
            {...handler()}
            multiple={multiple}
            size={multiple ? listSize : ''}
          >
            {emptyOptionText && <option value="">{emptyOptionText}</option>}
            {options}
          </select>
        </div>
      </div>
    </div>
  );

  Render.defaultProps = {
    touched: false,
    size: 10,
  };

  Render.propTypes = {
    handler: PropTypes.func.isRequired,
    size: PropTypes.number,
    touched: PropTypes.bool,
  };

  return Render;
};

export default SelectInput;
