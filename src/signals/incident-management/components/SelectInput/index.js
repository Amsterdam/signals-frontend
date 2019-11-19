import React from 'react';
import PropTypes from 'prop-types';

import Label from 'components/Label';

import './style.scss';

export const SelectInput = props => {
  const {
    name,
    display,
    values,
    multiple,
    useSlug,
    emptyOptionText,
    size,
  } = props;
  const options = values.map(({ key, value, slug }) => (
    <option
      key={useSlug ? slug : key}
      title={key ? value : emptyOptionText || value}
      value={useSlug ? slug : key}
    >
      {key ? value : emptyOptionText || value}
    </option>
  ));
  const listSize = values.length > size ? size : values.length;

  const render = ({ handler }) => (
    <div className="select-input">
      <div className="mode_input text rij_verplicht">
        {display && (
          <Label htmlFor={`form${name}`}>{display}</Label>
        )}

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
    </div>
  );

  render.defaultProps = {
    touched: false,
    size: 10,
  };

  render.propTypes = {
    handler: PropTypes.func.isRequired,
    size: PropTypes.number,
    touched: PropTypes.bool,
  };
  return render;
};

export default SelectInput;
