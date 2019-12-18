import React, { Fragment, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Label from '../Label';

const FilterGroup = styled.div`
  position: relative;

  & + & {
    margin-top: 30px;
  }
`;

const Toggle = styled.label`
  display: inline-block;
  color: rgb(0, 70, 153);
  margin-left: 20px;
  cursor: pointer;
  text-decoration: underline;
  font-size: 16px;
  line-heoght: 20px;

  &:hover {
    color: rgb(236, 0, 0);
  }

  &:focus {
    background-color: rgb(254, 200, 19);
  }

  & + input[type='checkbox'] {
    visibility: hidden;
    margin-left: -99999em;
  }
`;

/**
 * Component that renders a group of checkboxes that can optionally be collectively toggled on or off
 *
 * With props toggleFieldName=maincategory_slug, groupName=afval and clusterName=category_slug, will render the following boxes:
 * @example
 * <input type="checkbox" name="maincategory_slug" value="afval" /> <!-- toggle element -->
 * <input type="checkbox" name="afval_category_slug" value="..." />
 * <input type="checkbox" name="afval_category_slug" value="..." />
 */
const CheckboxList = ({
  clusterName,
  defaultValue,
  groupId,
  groupName,
  options,
  title,
  toggleFieldName,
  toggleLabel,
  isGroupHeader,
}) => {
  const groupContainer = useRef(null);

  /**
   * Check or uncheck all boxes in this group
   *
   * @param {Boolean} [shouldBeChecked=true]
   */
  const setGroupChecked = (shouldBeChecked = true) => {
    const checkboxes = groupContainer.current.querySelectorAll(
      'input[type="checkbox"]',
    );
    checkboxes.forEach(el => {
      // eslint-disable-next-line no-param-reassign
      el.checked = shouldBeChecked;
    });
  };

  /**
   * Unchecks the toggle checkbox whenever a checkbox from the list is checked
   */
  const handleIndividualCheck = () => {
    const mainSlugCheckbox = groupContainer.current.querySelector(
      `input[type="checkbox"][name="${toggleFieldName}"]`,
    );

    if (!mainSlugCheckbox) return;

    mainSlugCheckbox.checked = false;
  };

  /**
   * Check or uncheck all boxes whenever the toggle box is (un)checked
   *
   * @param {Event} event
   */
  const handleToggleCheck = event => {
    event.persist();

    const { target } = event;
    const { value } = target.dataset;
    const shouldBeChecked = value === 'none';

    setGroupChecked(shouldBeChecked);

    target.dataset.value = shouldBeChecked ? 'all' : 'none';
  };

  /**
   * Checks if a field should be displayed as checked
   *
   * @param   {String} key - the value of a field's properties that should be compared with the list of defaultChecked values
   * @param   {String} [indexName='id'] - the name of the prop who's value should be compared
   * @returns {Boolean}
   */
  const isDefaultChecked = id => defaultValue.findIndex(value => value.id === id || value.key === id) >= 0;
  const isGroupChecked = groupId ? isDefaultChecked(groupId) : defaultValue.length === options.length;

  // mount
  useEffect(() => {
    if (isGroupChecked) {
      setGroupChecked();
    }
  }, []);

  const displayToggle = !!toggleLabel;
  const firstOptionIdentifier = options[0].id || options[0].key;

  return (
    <FilterGroup ref={groupContainer}>
      {title && (
        <Label htmlFor={firstOptionIdentifier} isGroupHeader={isGroupHeader}>
          {title}
        </Label>
      )}

      {displayToggle && (
        <Fragment>
          <Toggle htmlFor={`${groupName}_toggle`} tabIndex={0}>
            {toggleLabel}
          </Toggle>

          <input
            type="checkbox"
            data-value={isGroupChecked ? 'all' : 'none'}
            name={toggleFieldName}
            id={`${groupName}_toggle`}
            onClick={handleToggleCheck}
            value={groupName}
          />
        </Fragment>
      )}

      {options.map(({
        id, key, slug, value,
      }) => {
        const optionIdentifier = id || key;
        const optionValue = slug || key;

        return (
          <div className="antwoord" key={optionIdentifier}>
            <input
              type="checkbox"
              id={optionIdentifier}
              name={`${groupName}${clusterName ? `_${clusterName}` : ''}`}
              value={optionValue}
              defaultChecked={isDefaultChecked(optionIdentifier)}
              onClick={handleIndividualCheck}
            />
            <label htmlFor={optionIdentifier}>{value}</label>
          </div>
        );
      })}
    </FilterGroup>
  );
};

CheckboxList.defaultProps = {
  defaultValue: [],
  toggleLabel: 'Alles selecteren',
  isGroupHeader: false,
  groupId: null,
  toggleFieldName: null,
};

CheckboxList.propTypes = {
  /**
   * Value of the `name` attribute of all the boxes in the group. Used to distinguish between the toggle checkbox and
   * the rest of the boxes
   */
  clusterName: PropTypes.string,
  /** List of keys for elements that need to be checked by default */
  defaultValue: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
    }),
  ),
  /**
   * Unique group identifier. Is used to check for toggling the group checkbox
   */
  groupId: PropTypes.string,
  /**
   * Value of the `name` attribute of the toggle box. This value is used to identify all children by without having
   * to select them all.
   */
  groupName: PropTypes.string.isRequired,
  /** Values to be rendered as checkbox elements */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      key: PropTypes.string,
      slug: PropTypes.string,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  /** Group label contents */
  title: PropTypes.string,
  /**
   * Name of the toggle field as it should appear in the form data. Note that both `toggleLabel` and `toggleFieldName`
   * are required to render the group's toggle
   */
  toggleFieldName: PropTypes.string,
  /** Text label for the group toggle */
  toggleLabel: PropTypes.string,
  /** When true, the title will render with the red header colour */
  isGroupHeader: PropTypes.bool,
};

export default CheckboxList;
