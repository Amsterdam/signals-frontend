import React from 'react';

import Label from 'components/Label';
import {
  FilterGroup as Styled,
} from './styled';
import CheckboxList from '../CheckboxList';

const FilterGroup = ({ options, defaultValue, name, title }) => (
  <Styled data-testid={`${name}FilterGroup`}>
    <CheckboxList
      defaultValue={defaultValue}
      hasToggle
      options={options}
      name={name}
      title={
        <Label as="span" isGroupHeader>
          {title}
        </Label>
      }
    />
  </Styled>
);

export default FilterGroup;
