import React, { Fragment, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
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

const getTransformedData = formData => {
  // the API expect a different data structure than we initally received
  // data needs to be transformed before it is sent out 🙄
  const transformedData = { ...formData, new_sla: formData.sla };

  delete transformedData.sla;

  return transformedData;
};

/**
 * Comparison function for incoming and outgoing form data
 *
 * @param   {Object} - First object to compare
 * @param   {Object} - Second object to compare against the first object
 * @returns {Boolean}
 */
const isEqual = ({ description, handling_message, is_active, name, sla }, othValue) =>
  [
    description === othValue.description,
    handling_message === othValue.handling_message,
    is_active === othValue.is_active,
    name === othValue.name,
    sla.n_days === othValue.sla.n_days,
    sla.use_calendar_days === othValue.sla.use_calendar_days,
  ].every(Boolean);

const CategoryDetail = () => {
  const entityName = 'Categorie';

  const location = useLocation();
  const redirectURL = location.referrer || routes.categories;

  const { categoryId } = useParams();
  const isExistingCategory = categoryId !== undefined;

  const { isLoading, isSuccess, error, data, get, patch } = useFetch();
  const historyFetch = useFetch();

  const confirmedCancel = useConfirmedCancel(redirectURL);

  const dispatch = useDispatch();

  const categoryURL = `${configuration.CATEGORIES_PRIVATE_ENDPOINT}${categoryId}`;

  const shouldRenderForm = !isExistingCategory || (isExistingCategory && Boolean(data));

  const userCan = useSelector(makeSelectUserCan);

  const userCanSubmitForm =
    (isExistingCategory && userCan('change_category')) || (!isExistingCategory && userCan('add_category'));

  useFetchResponseNotification({
    entityName,
    error,
    isExisting: isExistingCategory,
    isLoading,
    isSuccess,
    redirectURL,
  });

  const title = `${entityName} ${isExistingCategory ? 'wijzigen' : 'toevoegen'}`;

  const getFormData = useCallback(
    event => {
      const formData = [...new FormData(event.target.form).entries()]
        // convert stringified boolean values to actual booleans
        .map(([key, val]) => [key, key === 'is_active' ? val === 'true' : val])
        // convert line endings
        // by spec, the HTML value should contain \r\n, but the API only contains \n
        .map(([key, val]) => [key, typeof val === 'string' ? val.replace(/\r\n/g, '\n') : val])
        // reduce the entries() array to an object, merging it with the initial data
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), { ...data });

      const sla = {
        n_days: Number.parseInt(formData.n_days, 10),
        use_calendar_days: Boolean(Number.parseInt(formData.use_calendar_days, 10)),
      };

      delete formData.n_days;
      delete formData.use_calendar_days;

      return { ...formData, sla };
    },
    [data]
  );

  const onCancel = useCallback(
    event => {
      const formData = getFormData(event);
      const initialData = Object.entries(data)
        .map(([key, value]) => [key, value === null ? '' : value])
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), { ...data });
      const combinedData = { ...initialData, ...formData };
      const isPristine = isEqual(initialData, combinedData);

      confirmedCancel(isPristine);
    },
    [confirmedCancel, data, getFormData]
  );

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      const formData = getTransformedData(getFormData(event));

      patch(categoryURL, formData);
    },
    [categoryURL, patch, getFormData]
  );

  useEffect(() => {
    if (isSuccess) {
      dispatch(fetchCategories());
    }
  }, [isSuccess, dispatch]);

  useEffect(() => {
    if (isExistingCategory) {
      get(categoryURL);
      historyFetch.get(`${categoryURL}/history`);
    }

    // Disabling linter; only need to execute on mount; defining the dependencies
    // will throw the component in an endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageHeader title={title} BackLink={<BackLink to={redirectURL}>Terug naar overzicht</BackLink>} />

      {isLoading && <LoadingIndicator />}

      <FormContainer>
        {shouldRenderForm && (
          <CategoryForm
            data={data}
            history={historyFetch.data}
            onCancel={onCancel}
            onSubmitForm={onSubmit}
            readOnly={!userCanSubmitForm}
          />
        )}
      </FormContainer>
    </Fragment>
  );
};

export default CategoryDetail;
