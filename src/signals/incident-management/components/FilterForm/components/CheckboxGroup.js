import React, { memo } from 'react';
import PropTypes from 'prop-types';

import * as types from 'shared/types';
import Label from 'components/Label';
import CheckboxList from '../../CheckboxList';
import { FilterGroup } from '../styled';

const renderId = 0;

const CheckboxGroup = ({ defaultValue, label, name, hasToggle, onChange, onToggle, options }) =>
  Array.isArray(options) &&
  options.length > 0 && (
    <FilterGroup data-testid={`${name}CheckboxGroup`} data-render-id={renderId + 1}>
      <CheckboxList
        defaultValue={defaultValue}
        hasToggle={hasToggle}
        name={name}
        onChange={onChange}
        onToggle={onToggle}
        options={options}
        title={
          <Label as="span" isGroupHeader>
            {label}
          </Label>
        }
      />
    </FilterGroup>
  );

CheckboxGroup.defaultProps = {
  defaultValue: [],
  hasToggle: true,
};

CheckboxGroup.propTypes = {
  defaultValue: types.dataListType,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  hasToggle: PropTypes.bool,
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
  options: types.dataListType.isRequired,
};

export default memo(CheckboxGroup);
