import React, {
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Row, themeSpacing } from '@datapunt/asc-ui';

import { makeSelectCategories } from 'containers/App/selectors';
import CheckboxList from 'signals/incident-management/components/CheckboxList';
import {
  ControlsWrapper,
  Fieldset,
  Form,
} from 'signals/incident-management/components/FilterForm/styled';
import Label from 'components/Label';
import FormFooter from 'components/FormFooter';
import * as types from 'shared/types';

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

const StyledFieldset = styled(Fieldset)`
  padding-top: ${themeSpacing(2)};
  padding-bottom: ${themeSpacing(10)};

  & > .Label {
    margin-bottom: ${themeSpacing(4)};
  }
`;

const StyledCheckboxList = styled(CheckboxList)`
  input[type='checkbox']:disabled + label::before {
    opacity: 0.3;
  }
`;

const parseOutputFormData = form => {
  const formData = new FormData(form);

  Array.from(formData.entries()).reduce((acc, [key, val]) => {
    const [, mainCategory, section] = key.match(
      /^([^_]+)_(is_responsible|can_view)_category_slug/
    );

    acc[section][val] = acc.can_view[val] || {};
    acc.is_responsible[val] = acc.is_responsible[val] || {};

    return acc;
  }, {});
};

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
        departmentCatProps.cat_id = departmentCategory.id;
        departmentCatProps.is_responsible = departmentCategory.is_responsible;
        departmentCatProps.can_view = departmentCategory.can_view;
      }

      return { ...{ ...subcategory, ...departmentCatProps } };
    });

    return { ...acc, [mainCategory]: subCategories };
  }, {});

const CategoryLists = ({ categories, categoryGroups }) => {
  const formRef = useRef(null);
  const [refs, setRefs] = useState({});
  const categoriesGrouped = useMemo(
    () => groupSubcategoriesByMainSlug(categoryGroups, categories),
    [categoryGroups, categories]
  );

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
      const subcategory = currentTargetId.replace(
        `${category}${idReplaceStr}`,
        ''
      );
      const { current: canViewSubRef } = refs.sub.can_view[category][
        subcategory
      ];

      if (!canViewSubRef) return;

      const sameStates = currentTarget.checked === canViewSubRef.checked;

      if (!sameStates) {
        canViewSubRef.dispatchEvent(event);
      }

      canViewSubRef.checked = currentTarget.checked;
      canViewSubRef.disabled = currentTarget.checked;
    },
    [refs.sub]
  );

  /**
   * Checks and disables all checkbox in a group of the can_view list of options
   *
   * @param {(Object|Event)} eventOrObject
   * @param {HTMLInputElement} eventOrObject.currentTarget - Group toggle checkbox
   */
  const checkAllCorresponding = useCallback(
    ({ currentTarget }) => {
      const category = currentTarget.value.replace('_is_responsible', '');

      Object.keys(refs.sub.is_responsible[category]).forEach(subcat => {
        const { current } = refs.sub.is_responsible[category][subcat];

        if (current) {
          checkCorresponding({ currentTarget: current });
        }
      });

      const corresponding = refs.main.can_view[category];

      if (!corresponding.current) return;

      corresponding.current.disabled = currentTarget.checked;
    },
    [refs, checkCorresponding]
  );

  useLayoutEffect(() => {
    const mainRefs = { can_view: {}, is_responsible: {} };

    const subRefs = Object.keys(categoriesGrouped).reduce(
      (acc, val) => {
        mainRefs.can_view[val] = React.createRef();
        mainRefs.is_responsible[val] = React.createRef();

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

    setRefs({
      main: mainRefs,
      sub: subRefs,
    });
  }, [categoriesGrouped]);

  useEffect(() => {
    if (!refs.main && !refs.sub) return undefined;

    Object.keys(refs.sub.is_responsible).forEach(category => {
      Object.keys(refs.sub.is_responsible[category]).forEach(subcat => {
        const { current } = refs.sub.is_responsible[category][subcat];

        if (current) {
          current.addEventListener('change', checkCorresponding);
          checkCorresponding({ currentTarget: current });
        }
      });
    });

    Object.keys(refs.main.is_responsible).forEach(category => {
      const { current } = refs.main.is_responsible[category];

      if (current) {
        current.addEventListener('change', checkAllCorresponding);
      }
    });

    return () => {
      Object.keys(refs.sub.is_responsible).forEach(category => {
        Object.keys(refs.sub.is_responsible[category]).forEach(subcat => {
          const { current } = refs.sub.is_responsible[category][subcat];

          if (current) {
            current.removeEventListener('change', checkCorresponding);
          }
        });
      });

      Object.keys(refs.main.is_responsible).forEach(category => {
        const { current } = refs.main.is_responsible[category];

        if (current) {
          current.removeEventListener('change', checkAllCorresponding);
        }
      });
    };
  }, [refs.main, refs.sub, checkAllCorresponding, checkCorresponding]);

  const onCancel = () => {
    debugger;
  };

  const onSubmitForm = useCallback(
    evt => {
      evt.preventDefault();
      const formData = parseOutputFormData(evt.target.form);
      debugger;
    },
    [formRef.current]
  );

  /**
   * Selecting categories:
   * - checking one in is_responsible also checks the corresponding checkbox in can_view
   * - is_responsible checked disables the corresponding can_view checkbox
   * - can_view checkbox is enabled when corresponding is_responsible checkbox is not checked
   */
  return (
    <Row>
      <Form ref={formRef}>
        <ControlsWrapper>
          <StyledFieldset>
            <Label as="span" isGroupHeader>
              Verantwoordelijk voor categorie
            </Label>

            {refs.sub &&
              Object.keys(categoriesGrouped)
                .sort()
                .map(mainCategory => {
                  if (!refs.sub.is_responsible[mainCategory]) {
                    return null;
                  }

                  const mainCatObj = categories.main.find(
                    ({ slug }) => slug === mainCategory
                  );
                  const options = categoriesGrouped[mainCategory].map(
                    option => ({
                      ...option,
                      ref: refs.sub.is_responsible[mainCategory][option.id],
                    })
                  );

                  const departmentCategory = categoryGroups.find(({
                    category: {
                      _links: {
                        self: { href },
                      },
                    },
                  }) => href.startsWith(mainCatObj.key));

                  if (!departmentCategory) {
                    debugger;
                  }

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
                      toggleRef={refs.main.is_responsible[mainCategory]}
                    />
                  );
                })}
          </StyledFieldset>
        </ControlsWrapper>
        <ControlsWrapper>
          <StyledFieldset>
            <Label as="span" isGroupHeader>
              Toegang tot categorie
            </Label>

            {refs.sub &&
              Object.keys(categoriesGrouped)
                .sort()
                .map(mainCategory => {
                  if (!refs.sub.can_view[mainCategory]) {
                    return null;
                  }

                  const mainCatObj = categories.main.find(
                    ({ slug }) => slug === mainCategory
                  );
                  const options = categoriesGrouped[mainCategory].map(
                    option => ({
                      ...option,
                      ref: refs.sub.can_view[mainCategory][option.id],
                    })
                  );

                  return (
                    <StyledCheckboxList
                      defaultValue={categoriesWith('can_view', options)}
                      groupId={`${mainCatObj.key}_can_view`}
                      groupName="maincategory_slug_can_view"
                      groupValue={`${mainCatObj.slug}_can_view`}
                      key={mainCategory}
                      name={`${mainCatObj.slug}_can_view_category_slug`}
                      options={options}
                      title={<Label as="span">{mainCatObj.value}</Label>}
                      toggleRef={refs.main.can_view[mainCategory]}
                    />
                  );
                })}
          </StyledFieldset>
        </ControlsWrapper>

        <FormFooter
          cancelBtnLabel="Annuleren"
          onCancel={onCancel}
          onSubmitForm={onSubmitForm}
          submitBtnLabel="Opslaan"
        />
      </Form>
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
