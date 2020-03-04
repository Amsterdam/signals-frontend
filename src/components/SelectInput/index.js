import React from 'react';
import PropTypes from 'prop-types';

import { Select } from '@datapunt/asc-ui';

const SelectInput = ({ handler, name, options, value }) => (
  <Select value={value} onChange={handler}>
    {options.map(option => (
      <option key={`${name}-${option.key}`} value={option.value}>{option.label}</option>
    ))}
  </Select>
);

SelectInput.propTypes = {
  name: PropTypes.string,
  handler: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.string,
};

export default SelectInput;
