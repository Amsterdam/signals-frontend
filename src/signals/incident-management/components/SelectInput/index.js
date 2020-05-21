import React from 'react';
import PropTypes from 'prop-types';

import Select from 'components/SelectInput';

import './style.scss';

export const SelectInput = props => {
  const { name, display, values, useSlug, emptyOptionText } = props;
  const options = values.map(({ key, value, slug }) => ({
    name: key ? value : emptyOptionText || value,
    value: useSlug ? slug : key,
  }));

  const render = ({ handler }) => (
    <div className="select-input__control">
      <Select
        label={<strong>{display}</strong>}
        name={name}
        data-testid={name}
        id={`form${name}`}
        {...handler()}
        options={options}
      />
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
