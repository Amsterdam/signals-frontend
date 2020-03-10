import React from 'react';
import PropTypes from 'prop-types';

import { Select } from '@datapunt/asc-ui';

const SelectInput = ({ onChange, name, options, value }) => (
  <Select value={value} onChange={onChange}>
    {options.map(option => (
      <option key={`${name}-${option.key}`} value={option.value}>{option.name}</option>
    ))}
  </Select>
);

SelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired
  ).isRequired,
  value: PropTypes.string,
};

export default SelectInput;
