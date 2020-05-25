import React, { memo } from 'react';
import PropTypes from 'prop-types';

import * as types from 'shared/types';
import Label from 'components/Label';
import RadioButtonList from '../../RadioButtonList';
import { FilterGroup } from '../styled';

const RadioGroup = ({ defaultValue, onChange, options, name, label }) =>
  Array.isArray(options) &&
  options.length > 0 && (
    <FilterGroup data-testid={`${name}RadioGroup`}>
      <Label as="span" isGroupHeader>
        {label}
      </Label>
      <RadioButtonList
        hasEmptySelectionButton
        defaultValue={defaultValue}
        groupName={name}
        onChange={onChange}
        options={options}
      />
    </FilterGroup>
  );

RadioGroup.defaultProps = {
  defaultValue: '',
};

RadioGroup.propTypes = {
  defaultValue: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: types.dataListType.isRequired,
};

export default memo(RadioGroup);
