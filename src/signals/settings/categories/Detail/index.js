import React, { Fragment, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useParams, useLocation } from 'react-router-dom';
// import isEqual from 'lodash.isequal';
import styled from 'styled-components';

import configuration from 'shared/services/configuration/configuration';
import { makeSelectUserCan } from 'containers/App/selectors';
import PageHeader from 'signals/settings/components/PageHeader';
import LoadingIndicator from 'shared/components/LoadingIndicator';

import { fetchCategories } from 'models/categories/actions';
import BackLink from 'components/BackLink';
import routes from 'signals/settings/routes';
import useFetch from 'hooks/useFetch';

import useConfirmedCancel from '../../hooks/useConfirmedCancel';
import useFetchResponseNotification from '../../hooks/useFetchResponseNotification';
import CategoryForm from './components/CategoryForm';

const FormContainer = styled.div`
  // taking into account the space that the FormFooter component takes up
  padding-bottom: 66px;
`;

export const CategoryDetailContainerComponent = ({ userCan }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { categoryId } = useParams();

  const redirectURL = location.referrer || routes.categories;
  const confirmedCancel = useConfirmedCancel(redirectURL);
  const isExistingCategory = categoryId !== undefined;
  const categoryURL = `${configuration.CATEGORIES_PRIVATE_ENDPOINT}${categoryId}`;

  const { isLoading, isSuccess, error, data, get, patch } = useFetch();
  const shouldRenderForm =
    !isExistingCategory || (isExistingCategory && Boolean(data));
  const userCanSubmitForm = useMemo(
    () =>
      (isExistingCategory && userCan('change_category')) ||
      (!isExistingCategory && userCan('add_category')),
    [isExistingCategory, userCan]
  );
  const entityName = 'Categorie';

  useFetchResponseNotification({
    entityName,
    error,
    isExisting: isExistingCategory,
    isLoading,
    isSuccess,
    redirectURL,
  });

  const reFetchCategories = useCallback(() => dispatch(fetchCategories()), [
    dispatch,
  ]);

  const title = `${entityName} ${
    isExistingCategory ? 'wijzigen' : 'toevoegen'
  }`;

  const onSubmitForm = useCallback(
    event => {
      event.preventDefault();
      const formData = [...new FormData(event.target.form).entries()]
        // convert stringified boolean values to actual booleans
        .map(([key, val]) => [key, key === 'is_active' ? val === 'true' : val])
        // reduce the entries() array to an object, merging it with the initial data
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), { ...data });

      const sla = {
        n_days: parseInt(formData.n_days, 10),
        use_calendar_days: Boolean(parseInt(formData.use_calendar_days, 10)),
      };

      delete formData.n_days;
      delete formData.use_calendar_days;

      patch(categoryURL, { ...formData, sla });
    },
    [categoryURL, patch, data]
  );

  useEffect(() => {
    if (isSuccess) {
      reFetchCategories();
    }
  }, [isSuccess, reFetchCategories]);

  useEffect(() => {
    get(categoryURL);
    // Disabling linter; only need to execute on mount; defining the dependencies
    // will throw the component in an endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeader
        title={title}
        BackLink={<BackLink to={redirectURL}>Terug naar overzicht</BackLink>}
      />

      {isLoading && <LoadingIndicator />}

      <FormContainer>
        {shouldRenderForm && (
          <CategoryForm
            data={data}
            onCancel={confirmedCancel}
            onSubmitForm={onSubmitForm}
            readOnly={!userCanSubmitForm}
          />
        )}
      </FormContainer>
    </Fragment>
  );
};

CategoryDetailContainerComponent.propTypes = {
  userCan: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userCan: makeSelectUserCan,
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(CategoryDetailContainerComponent);
