import React, { memo } from 'react';

import Label from 'components/Label';
import RadioButtonList from '../RadioButtonList';
import { FilterGroup } from './styled';

const RadioGroup = ({ defaultValue, onChange, options, name, label }) =>
  Array.isArray(options) &&
  options.length > 0 && (
    <FilterGroup data-testid={`${name}FilterGroup`}>
      <Label htmlFor={`${name}_${options[0].key}`} isGroupHeader>
        {label}
      </Label>
      <RadioButtonList
        defaultValue={defaultValue}
        onChange={onChange}
        options={options}
        groupName={name}
      />
    </FilterGroup>
  );

export default memo(RadioGroup);
