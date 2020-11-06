import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { Select as AscSelect } from '@amsterdam/asc-ui';

const SelectOptions = ({ name, options, optionKey, optionValue }) =>
  options.map(option => (
    <option key={`${name}-${option[optionKey]}`} value={option[optionKey]}>
      {option[optionValue]}
    </option>
  ));

const Select = forwardRef(
  ({ label, onChange, name, value, options, optionKey = 'key', optionValue = 'name', groups, emptyOption }, ref) => (
    <AscSelect value={value} onChange={onChange} data-testid={name} label={label} name={name} ref={ref}>
      {emptyOption && (
        <option key={`${name}-${emptyOption[optionKey]}`} value={emptyOption[optionKey]}>
          {emptyOption[optionValue]}
        </option>
      )}

      {groups?.length > 1 ?
        groups?.map(group => (
          <optgroup key={group.name} label={group.name}>
            <SelectOptions
              name={name}
              options={options.filter(option => option.group === group.value)}
              optionKey={optionKey}
              optionValue={optionValue}
            />
          </optgroup>
        ))
        : (
          <SelectOptions name={name} options={options} optionKey={optionKey} optionValue={optionValue} />
        )}
    </AscSelect>
  )
);

Select.defaultProps = {
  groups: null,
  emptyOption: null,
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
  optionKey: PropTypes.string,
  optionValue: PropTypes.string,
  value: PropTypes.string,
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  emptyOption: optionType,
};

export default Select;
