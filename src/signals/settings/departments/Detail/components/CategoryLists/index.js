import React, { useCallback, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, themeSpacing } from '@datapunt/asc-ui';
import isEqual from 'lodash.isequal';

import * as types from 'shared/types';

import {
  ControlsWrapper,
  Fieldset,
  Form,
} from 'signals/incident-management/components/FilterForm/styled';
import Label from 'components/Label';
import FormFooter from 'components/FormFooter';

import CategoryGroups from '../CategoryGroups';
import reducer from './reducer';
import { setCanView, setIsResponsible } from './actions';
import { incoming, outgoing } from '../mapCategories';

const StyledFieldset = styled(Fieldset)`
  padding-top: ${themeSpacing(2)};
  padding-bottom: ${themeSpacing(10)};
  & > .Label {
    margin-bottom: ${themeSpacing(4)};
  }
`;

/**
 * Component that renders two columns of checkboxes from the value of the
 * `subCategories` prop. Categories are grouped by their parent category.
 * Checkboxes in the `is_responsible` column have a one-on-one relation with
 * the checkboxes in the `can_view` column, meaning that when a `is_responsible`
 * checkbox is ticked, the corresponding checkbox in the `can_view` column is
 * also ticked and disabled. This doesn't go the other way around.
 *
 * The tick logic is handled by the component's reducer function.
 */
const CategoryLists = ({
  categories,
  department,
  findByMain,
  onCancel,
  onSubmit,
  subCategories,
}) => {
  const categoriesMapped = useMemo(
    () => incoming(department.categories, subCategories),
    [department.categories, subCategories]
  );
  const [state, dispatch] = useReducer(reducer, categoriesMapped);

  const onSubmitForm = useCallback(
    event => {
      event.preventDefault();
      const formData = outgoing(state);

      onSubmit(formData);
    },
    [onSubmit, state]
  );

  const onCancelForm = useCallback(() => {
    const isPristine = isEqual(outgoing(categoriesMapped), outgoing(state));

    onCancel(isPristine);
  }, [categoriesMapped, onCancel, state]);

  const onChangeCanViewCategories = useCallback(
    (slug, selectedSubCategories) => {
      dispatch(setCanView({ slug, subCategories: selectedSubCategories }));
    },
    [dispatch]
  );

  const onChangeIsResponsibleCategories = useCallback(
    (slug, selectedSubCategories) => {
      dispatch(
        setIsResponsible({ slug, subCategories: selectedSubCategories })
      );
    },
    [dispatch]
  );

  const onCanViewMainCategoryToggle = useCallback(
    (slug, isToggled) => {
      const selectedSubCategories = isToggled ? categories[slug].sub : [];
      dispatch(setCanView({ slug, subCategories: selectedSubCategories }));
    },
    [categories, dispatch]
  );

  const onIsResponsibleMainCategoryToggle = useCallback(
    (slug, isToggled) => {
      const selectedSubCategories = isToggled ? categories[slug].sub : [];
      dispatch(
        setIsResponsible({ slug, subCategories: selectedSubCategories })
      );
    },
    [categories, dispatch]
  );

  return (
    <Row>
      <Form>
        <ControlsWrapper>
          <StyledFieldset>
            <Label as="span" isGroupHeader>
              Verantwoordelijk voor categorie
            </Label>

            {categories && (
              <CategoryGroups
                boxWrapperKeyPrefix="is_responsible"
                categories={categories}
                findByMain={findByMain}
                onChange={onChangeIsResponsibleCategories}
                onToggle={onIsResponsibleMainCategoryToggle}
                state={state.is_responsible}
              />
            )}
          </StyledFieldset>
        </ControlsWrapper>

        <ControlsWrapper>
          <StyledFieldset>
            <Label as="span" isGroupHeader>
              Toegang tot categorie
            </Label>

            {categories && (
              <CategoryGroups
                boxWrapperKeyPrefix="can_view"
                categories={categories}
                findByMain={findByMain}
                onChange={onChangeCanViewCategories}
                onToggle={onCanViewMainCategoryToggle}
                state={state.can_view}
              />
            )}
          </StyledFieldset>
        </ControlsWrapper>

        <FormFooter
          cancelBtnLabel="Annuleren"
          onCancel={onCancelForm}
          onSubmitForm={onSubmitForm}
          submitBtnLabel="Opslaan"
        />
      </Form>
    </Row>
  );
};

CategoryLists.propTypes = {
  categories: types.categoriesType.isRequired,
  department: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
  findByMain: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  subCategories: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default CategoryLists;
