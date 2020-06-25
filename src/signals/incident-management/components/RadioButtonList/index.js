import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { RadioGroup, Radio, Label } from '@datapunt/asc-ui';

const FilterGroup = styled.div`
  position: relative;

  & + & {
    margin-top: 30px;
  }
`;

const StyledLabel = styled(Label)`
  * {
    font-weight: normal
  }
`;

/**
 * Component that renders a group of radio buttons
 */
const RadioButtonList = ({
  emptySelectionLabel,
  hasEmptySelectionButton,
  defaultValue,
  disabled,
  groupName,
  onChange,
  options,
  title,
}) => {
  const radioOptions = [...options];

  if (hasEmptySelectionButton && emptySelectionLabel) {
    radioOptions.unshift({ key: '', name: 'empty', value: emptySelectionLabel });
  }

  return (
    <FilterGroup>
      {title && (
        <Label as="span" isGroupHeader={false}>
          {title}
        </Label>
      )}

      <RadioGroup name={groupName} disabled={disabled}>
        {radioOptions.map(option => (
          <StyledLabel key={option.key || option.name} htmlFor={option.key || option.name} label={option.value}>
            <Radio
              checked={option.key === defaultValue}
              id={option.key || option.name}
              onChange={() => {
                onChange(groupName, option);
              }}
              value={option.key}
            />
          </StyledLabel>
        ))}
      </RadioGroup>
    </FilterGroup>
  );
};

RadioButtonList.defaultProps = {
  emptySelectionLabel: 'Alles',
  defaultValue: '',
  disabled: false,
  hasEmptySelectionButton: true,
  onChange: () => {},
};

RadioButtonList.propTypes = {
  /** List of keys for elements that need to be checked by default */
  defaultValue: PropTypes.string,
  /** When true, will disable all elements in the list */
  disabled: PropTypes.bool,
  /** Text label for the radio button with the empty value */
  emptySelectionLabel: PropTypes.string,
  /**
   * Value of the `name` attribute of the toggle box. This value is used to identify all children by without having
   * to select them all.
   */
  groupName: PropTypes.string.isRequired,
  /** When false, will only render the passed in options instead of having an extra radio button with an empty value */
  hasEmptySelectionButton: PropTypes.bool,
  onChange: PropTypes.func,
  /** Values to be rendered as checkbox elements */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** Group label contents */
  title: PropTypes.string,
};

export default RadioButtonList;
