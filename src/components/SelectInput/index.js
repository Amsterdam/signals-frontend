import React from 'react';
import PropTypes from 'prop-types';

import { Select } from '@datapunt/asc-ui';

const SelectInput = ({ handler, key, options, value }) => (
  <Select value={value} onChange={handler}>
    {Object.keys(options).map(option => (
      <option key={`${key}-${option}`} value={option}>{options[option]}</option>
    ))}
  </Select>
);

SelectInput.propTypes = {
  key: PropTypes.string,
  handler: PropTypes.func,
  options: PropTypes.object,
  value: PropTypes.string,
};

export default SelectInput;
