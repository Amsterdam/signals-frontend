import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Row, Column, themeSpacing } from '@datapunt/asc-ui';

import { makeSelectCategories } from 'containers/App/selectors';
import CheckboxList from 'signals/incident-management/components/CheckboxList';
import {
  ControlsWrapper,
  Fieldset,
} from 'signals/incident-management/components/FilterForm/styled';
import Label from 'components/Label';
import * as types from 'shared/types';

const StyledFieldset = styled(Fieldset)`
  padding-top: ${themeSpacing(2)};

  & > .Label {
    margin-bottom: ${themeSpacing(4)};
  }
`;

const StyledCheckboxList = styled(CheckboxList)`
  input[type='checkbox']:disabled + label::before {
    opacity: 0.3;
  }
`;

const categoriesWith = (prop, subcategories) =>
  subcategories
    .filter(subcategory => Boolean(subcategory[prop]))
    .map(({ id, name, slug }) => ({ key: id, value: name, slug }));

const groupSubcategoriesByMainSlug = (departmentCategories, { mainToSub }) =>
  Object.keys(mainToSub).reduce((acc, mainCategory) => {
    const subCategories = mainToSub[mainCategory].map(subcategory => {
      const departmentCategory = departmentCategories.find(
        ({
          category: {
            _links: {
              self: { href },
            },
          },
        }) => href === subcategory.id
      );
      const departmentCatProps = {};

      if (departmentCategory) {
        departmentCatProps.is_responsible = departmentCategory.is_responsible;
        departmentCatProps.can_view = departmentCategory.can_view;
        departmentCatProps.dep_cat_id = departmentCategory.id;
      }

      return { ...{ ...subcategory, ...departmentCatProps } };
    });

    return { ...acc, [mainCategory]: subCategories };
  }, {});

/**
 * Checks and disables checkbox in the can_view list of options
 * Will only check a box if there is a corresponding one in the is_responsible list
 * of options.
 *
 * @param {(Object|Event)} eventOrObject
 * @param {HTMLInputElement} eventOrObject.currentTarget - Single checkbox
 */
const checkCorresponding = ({ currentTarget }) => {
  const id = currentTarget.id.replace('is_responsible', 'can_view');
  const corresponding = document.getElementById(id);

  if (!corresponding) return;

  corresponding.checked = currentTarget.checked;
  corresponding.disabled = currentTarget.checked;
};

/**
 * Checks and disables all checkbox in a grop of the can_view list of options
 *
 * @param {(Object|Event)} eventOrObject
 * @param {HTMLInputElement} eventOrObject.currentTarget - Group toggle checkbox
 */
const checkAllCorresponding = ({ currentTarget }) => {
  currentTarget
    .closest('.categoryGroup')
    .querySelectorAll('input[type=checkbox]')
    .forEach(element => checkCorresponding({ currentTarget: element }));
};

const CategoryLists = ({ categories, categoryGroups }) => {
  const categoriesGrouped = useMemo(
    () => groupSubcategoriesByMainSlug(categoryGroups, categories),
    [categoryGroups, categories]
  );

  useEffect(() => {
    const isResponsibleCheckboxes = document.querySelectorAll(
      'input[type=checkbox][id^="is_responsible"]'
    );
    const isResponsibleToggles = document.querySelectorAll(
      'input[type=checkbox][id$="is_responsible_toggle"]'
    );

    if (!isResponsibleCheckboxes.length) return undefined;

    // is_responsible checkbox callback handlers
    isResponsibleCheckboxes.forEach(element => {
      element.addEventListener('change', checkCorresponding);
    });

    // disable can_view checkboxes where they aren't, but should be
    Array.from(isResponsibleCheckboxes)
      .filter(({ checked }) => checked)
      .forEach(currentTarget => checkCorresponding({ currentTarget }));

    // is_responsible toggle callback handlers
    isResponsibleToggles.forEach(toggleElement => {
      toggleElement.addEventListener('change', checkAllCorresponding);
    });

    return () => {
      isResponsibleCheckboxes.forEach(element => {
        element.removeEventListener('click', checkCorresponding);
      });

      isResponsibleToggles.forEach(toggleElement => {
        toggleElement.removeEventListener('change', checkAllCorresponding);
      });
    };
  }, []);

  /**
   * Selecting categories:
   * - checking one in is_responsible also checks the corresponding checkbox in can_view
   * - is_responsible checked disables the corresponding can_view checkbox
   * - can_view checkbox is enabled when corresponding is_responsible checkbox is not checked
   */

  return (
    <Row>
      <Column span={6}>
        <ControlsWrapper>
          <StyledFieldset>
            <Label as="span" isGroupHeader>
              Verantwoordelijk voor categorie
            </Label>

            {Object.keys(categoriesGrouped)
              .sort()
              .map(mainCategory => {
                const mainCatObj = categories.main.find(
                  ({ slug }) => slug === mainCategory
                );
                const options = categoriesGrouped[mainCategory];

                return (
                  <CheckboxList
                    className="categoryGroup"
                    defaultValue={categoriesWith('is_responsible', options)}
                    groupId={`${mainCatObj.key}_is_responsible`}
                    groupName="maincategory_slug_is_responsible"
                    groupValue={`${mainCatObj.slug}_is_responsible`}
                    hasToggle
                    key={mainCategory}
                    name={`${mainCatObj.slug}_category_slug`}
                    options={options}
                    title={mainCatObj.value}
                  />
                );
              })}
          </StyledFieldset>
        </ControlsWrapper>
      </Column>

      <Column span={6}>
        <ControlsWrapper>
          <StyledFieldset>
            <Label as="span" isGroupHeader>
              Toegang tot categorie
            </Label>

            {Object.keys(categoriesGrouped)
              .sort()
              .map(mainCategory => {
                const mainCatObj = categories.main.find(
                  ({ slug }) => slug === mainCategory
                );
                const options = categoriesGrouped[mainCategory];

                return (
                  <StyledCheckboxList
                    defaultValue={categoriesWith('can_view', options)}
                    groupId={`${mainCatObj.key}_can_view`}
                    groupName="maincategory_slug_can_view"
                    groupValue={`${mainCatObj.slug}_can_view`}
                    hasToggle
                    key={mainCategory}
                    name={`${mainCatObj.slug}_category_slug`}
                    options={options}
                    title={mainCatObj.value}
                  />
                );
              })}
          </StyledFieldset>
        </ControlsWrapper>
      </Column>
    </Row>
  );
};

CategoryLists.propTypes = {
  categories: types.categoriesType.isRequired,
  categoryGroups: types.departmentCategories.isRequired,
};

const mapStateToProps = () =>
  createStructuredSelector({
    categories: makeSelectCategories(),
  });

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(CategoryLists);
