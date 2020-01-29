import React, { memo } from 'react';

import Label from 'components/Label';
import CheckboxList from '../CheckboxList';
import { FilterGroup } from './styled';

const CheckboxGroup = ({
  defaultValue,
  onChange,
  onToggle,
  options,
  name,
  label,
}) =>
  Array.isArray(options) &&
  options.length > 0 && (
    <FilterGroup data-testid={`${name}FilterGroup`}>
      <CheckboxList
        defaultValue={defaultValue}
        hasToggle
        onChange={onChange}
        onToggle={onToggle}
        options={options}
        name={name}
        title={
          <Label as="span" isGroupHeader>
            {label}
          </Label>
        }
      />
    </FilterGroup>
  );

export default memo(CheckboxGroup);
