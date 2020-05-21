import React from 'react';
import PropTypes from 'prop-types';

import { Select } from '@datapunt/asc-ui';

const SelectInput = ({ label, onChange, name, options, value }) => (
  <Select value={value} onChange={onChange} data-testid={name} label={label}>
    {options.map(option => (
      <option key={`${name}-${option.key}`} value={option.value}>
        {option.name}
      </option>
    ))}
  </Select>
);

SelectInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired
  ).isRequired,
  value: PropTypes.string,
};

export default SelectInput;
