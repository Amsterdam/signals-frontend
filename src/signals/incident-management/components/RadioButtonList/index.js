import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Label from 'components/Label';

const FilterGroup = styled.div`
  position: relative;

  & + & {
    margin-top: 30px;
  }
`;

/**
 * Component that renders a group of radio buttons
 */
const RadioButtonList = ({
  emptySelectionLabel,
  hasEmptySelectionButton,
  defaultValue,
  groupName,
  options,
  title,
}) => (
  <FilterGroup>
    {title && (
      <Label htmlFor={options[0].key} isGroupHeader={false}>
        {title}
      </Label>
    )}

    {hasEmptySelectionButton && emptySelectionLabel && (
      <div className="antwoord">
        <input
          type="radio"
          id={`empty_${groupName}`}
          name={groupName}
          value=""
          defaultChecked={defaultValue === ''}
        />
        <label htmlFor={`empty_${groupName}`}>{emptySelectionLabel}</label>
      </div>
    )}

    {options.map(({ key, value }) => (
      <div className="antwoord" key={key}>
        <input
          type="radio"
          id={key}
          name={groupName}
          value={key}
          defaultChecked={key === defaultValue}
        />
        <label htmlFor={key}>{value}</label>
      </div>
    ))}
  </FilterGroup>
);

RadioButtonList.defaultProps = {
  emptySelectionLabel: 'Alles',
  defaultValue: '',
  hasEmptySelectionButton: true,
};

RadioButtonList.propTypes = {
  /** List of keys for elements that need to be checked by default */
  defaultValue: PropTypes.string,
  /** Text label for the radio button with the empty value */
  emptySelectionLabel: PropTypes.string,
  /**
   * Value of the `name` attribute of the toggle box. This value is used to identify all children by without having
   * to select them all.
   */
  groupName: PropTypes.string.isRequired,
  /** When false, will only render the passed in options instead of having an extra radio button with an empty value */
  hasEmptySelectionButton: PropTypes.bool,
  /** Values to be rendered as checkbox elements */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  /** Group label contents */
  title: PropTypes.string,
};

export default RadioButtonList;
