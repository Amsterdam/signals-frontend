import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useMemo,
  useCallback,
} from 'react';
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
        // departmentCatProps.dep_cat_id = departmentCategory.id;
      }

      return { ...{ ...subcategory, ...departmentCatProps } };
    });

    return { ...acc, [mainCategory]: subCategories };
  }, {});

let event;
if (typeof MouseEvent === 'function') {
  event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: false,
  });
} else {
  event = document.createEvent('MouseEvent');
  const bubbles = true;
  const cancelable = false;
  event.initEvent('click', bubbles, cancelable);
}

const functionsList = new Set();

const CategoryLists = ({ categories, categoryGroups }) => {
  const [refs, setRefs] = useState();
  const categoriesGrouped = useMemo(
    () => groupSubcategoriesByMainSlug(categoryGroups, categories),
    [categoryGroups, categories]
  );

  /**
   * Checks and disables all checkbox in a grop of the can_view list of options
   *
   * @param {(Object|Event)} eventOrObject
   * @param {HTMLInputElement} eventOrObject.currentTarget - Group toggle checkbox
   */
  const checkAllCorresponding = useCallback(
    ({ currentTarget }) => {
      const category = currentTarget.value.replace('_is_responsible', '');

      Object.keys(refs.can_view[category]).forEach(subCat => {
        const { current } = refs.is_responsible[category][subCat];

        checkCorresponding({ currentTarget: current });
      });
    },
    [checkCorresponding, refs]
  );

  functionsList.add(checkAllCorresponding);

  /**
   * Checks and disables checkbox in the can_view list of options
   * Will only check a box if there is a corresponding one in the is_responsible list
   * of options.
   *
   * @param {(Object|Event)} eventOrObject
   * @param {HTMLInputElement} eventOrObject.currentTarget - Single checkbox
   */
  const checkCorresponding = useCallback(
    ({ currentTarget }) => {
      const currentTargetId = currentTarget.id;
      const idReplaceStr = '_is_responsible_category_slug_';
      const [, category] = currentTarget.id.match(
        new RegExp(`([^_]+)${idReplaceStr}`)
      );
      const cleanId = currentTargetId.replace(`${category}${idReplaceStr}`, '');
      const ref = refs.can_view[category][cleanId];

      if (!ref.current) return;

      const sameStates = currentTarget.checked === ref.current.checked;

      if (!sameStates) {
        ref.current.dispatchEvent(event);
      }

      ref.current.checked = currentTarget.checked;
      ref.current.disabled = currentTarget.checked;
    },
    [refs.can_view]
  );

  functionsList.add(checkCorresponding);

  useLayoutEffect(() => {
    const optionRefs = Object.keys(categoriesGrouped).reduce(
      (acc, val) => {
        categoriesGrouped[val].forEach(({ id }) => {
          acc.can_view[val] = acc.can_view[val] || {};
          acc.is_responsible[val] = acc.is_responsible[val] || {};

          acc.can_view[val][id] = React.createRef();
          acc.is_responsible[val][id] = React.createRef();
        });

        return acc;
      },
      { can_view: {}, is_responsible: {} }
    );

    setRefs(optionRefs);
  }, [categoriesGrouped]);

  useEffect(() => {
    if (!refs) return undefined;

    Object.keys(refs.is_responsible).forEach(category => {
      Object.keys(refs.is_responsible[category]).forEach(subcat => {
        const { current } = refs.is_responsible[category][subcat];

        checkCorresponding({ currentTarget: current });
        current.addEventListener('change', checkCorresponding);
      });
    });

    const isResponsibleToggles = document.querySelectorAll(
      'input[type=checkbox][name="maincategory_slug_is_responsible"]'
    );

    // is_responsible toggle callback handlers
    isResponsibleToggles.forEach(toggleElement => {
      toggleElement.addEventListener('change', checkAllCorresponding);
    });

    return () => {
      Object.keys(refs.is_responsible).forEach(category => {
        Object.keys(refs.is_responsible[category]).forEach(subcat => {
          const { current } = refs.is_responsible[category][subcat];

          current.removeEventListener('change', checkCorresponding);
        });
      });

      isResponsibleToggles.forEach(toggleElement => {
        toggleElement.removeEventListener('change', checkAllCorresponding);
      });
    };
  });

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
          <div>
            Functions: {functionsList.size}
          </div>
          <StyledFieldset>
            <Label as="span" isGroupHeader>
              Verantwoordelijk voor categorie
            </Label>

            {refs &&
              Object.keys(categoriesGrouped)
                .sort()
                .map(mainCategory => {
                  if (!refs.is_responsible[mainCategory]) {
                    return null;
                  }

                  const mainCatObj = categories.main.find(
                    ({ slug }) => slug === mainCategory
                  );
                  const options = categoriesGrouped[mainCategory].map(
                    option => ({
                      ...option,
                      ref: refs.is_responsible[mainCategory][option.id],
                    })
                  );

                  return (
                    <CheckboxList
                      className="categoryGroup"
                      defaultValue={categoriesWith('is_responsible', options)}
                      groupId={`${mainCatObj.key}_is_responsible`}
                      groupName="maincategory_slug_is_responsible"
                      groupValue={`${mainCatObj.slug}_is_responsible`}
                      hasToggle
                      key={mainCategory}
                      name={`${mainCatObj.slug}_is_responsible_category_slug`}
                      options={options}
                      title={<Label as="span">{mainCatObj.value}</Label>}
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

            {refs &&
              Object.keys(categoriesGrouped)
                .sort()
                .map(mainCategory => {
                  if (!refs.can_view[mainCategory]) {
                    return null;
                  }

                  const mainCatObj = categories.main.find(
                    ({ slug }) => slug === mainCategory
                  );
                  const options = categoriesGrouped[mainCategory].map(
                    option => ({
                      ...option,
                      ref: refs.can_view[mainCategory][option.id],
                    })
                  );

                  return (
                    <StyledCheckboxList
                      defaultValue={categoriesWith('can_view', options)}
                      groupId={`${mainCatObj.key}_can_view`}
                      groupName="maincategory_slug_can_view"
                      groupValue={`${mainCatObj.slug}_can_view`}
                      hasToggle
                      key={mainCategory}
                      name={`${mainCatObj.slug}_can_view_category_slug`}
                      options={options}
                      title={<Label as="span">{mainCatObj.value}</Label>}
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
