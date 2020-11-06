import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { Select as AscSelect } from '@amsterdam/asc-ui';

const SelectOptions = ({ name, options }) =>
  options.map(option => (
    <option key={`${name}-${option.key}`} value={option.key}>
      {option.name}
    </option>
  ));

const Select = forwardRef(({ label, onChange, name, value, options, groups, emptyOption }, ref) => (
  <AscSelect value={value} onChange={onChange} data-testid={name} label={label} name={name} ref={ref}>
    {emptyOption && (
      <option key={`${name}-${emptyOption.key}`} value={emptyOption.key}>
        {emptyOption.name}
      </option>
    )}

    {groups?.length > 1 ?
      groups?.map(group => (
        <optgroup key={group.name} label={group.name}>
          <SelectOptions name={name} options={options.filter(option => option.group === group.value)} />
        </optgroup>
      ))
      : (
        <SelectOptions name={name} options={options} />
      )}
  </AscSelect>
));

Select.defaultProps = {
  groups: null,
};

const optionType = PropTypes.shape({
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).isRequired,
  group: PropTypes.string,
});

Select.propTypes = {
  label: PropTypes.node,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(optionType.isRequired).isRequired,
  value: PropTypes.string,
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  emptyOption: PropTypes.optionType,
};

export default Select;
