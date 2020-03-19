import React, { Fragment, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import isEqual from 'lodash.isequal';
import styled from 'styled-components';

import configuration from 'shared/services/configuration/configuration';
import { makeSelectUserCan } from 'containers/App/selectors';
import PageHeader from 'signals/settings/components/PageHeader';
import LoadingIndicator from 'shared/components/LoadingIndicator';

import BackLink from 'components/BackLink';
import routes from 'signals/settings/routes';
import useFetch from 'hooks/useFetch';

import useFetchResponseNotification from 'signals/settings/hooks/useFetchResponseNotification';
import useConfirmedCancel from 'signals/settings/hooks/useConfirmedCancel';
import UserForm from './components/UserForm';

const FormContainer = styled.div`
  // taking into account the space that the FormFooter component takes up
  padding-bottom: 66px;
`;

const UserDetail = () => {
  const entityName = 'Gebruiker';
  const { userId } = useParams();
  const location = useLocation();
  const userCan = useSelector(makeSelectUserCan);

  const isExistingUser = userId !== undefined;
  const { isLoading, isSuccess, error, data, get, patch, post } = useFetch();
  const shouldRenderForm = !isExistingUser || (isExistingUser && Boolean(data));
  const redirectURL = location.referrer || routes.users;
  const userCanSubmitForm = (isExistingUser && userCan('change_user')) || (!isExistingUser && userCan('add_user'));
  const confirmedCancel = useConfirmedCancel(redirectURL);

  useFetchResponseNotification({
    entityName,
    error,
    isExisting: isExistingUser,
    isLoading,
    isSuccess,
    redirectURL,
  });

  const getFormData = useCallback(
    e => {
      const formData = [...new FormData(e.target.form).entries()]
        // convert stringified boolean values to actual booleans
        .map(([key, val]) => [key, key === 'is_active' ? val === 'true' : val])
        // reduce the entries() array to an object, merging it with the initial data
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), { ...data });

      formData.profile = {
        ...formData.profile,
        note: formData.note,
      };
      delete formData.note;

      return formData;
    },
    [data]
  );

  useEffect(() => {
    if (userId) {
      get(`${configuration.USERS_ENDPOINT}${userId}`);
    }
    // disabling linter; only need to execute on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitForm = useCallback(
    e => {
      e.preventDefault();

      const formData = getFormData(e);

      if (isEqual(data, formData)) {
        return;
      }

      if (isExistingUser) {
        patch(`${configuration.USERS_ENDPOINT}${userId}`, formData);
      } else {
        post(configuration.USERS_ENDPOINT, formData);
      }
    },
    [data, getFormData, patch, isExistingUser, post, userId]
  );

  const onCancel = useCallback(
    e => {
      const formData = getFormData(e);
      const isPristine = isEqual(data, formData);
      confirmedCancel(isPristine);
    },
    [data, getFormData, confirmedCancel]
  );

  const title = `${entityName} ${isExistingUser ? 'wijzigen' : 'toevoegen'}`;

  return (
    <Fragment>
      <PageHeader title={title} BackLink={<BackLink to={redirectURL}>Terug naar overzicht</BackLink>} />

      {isLoading && <LoadingIndicator />}

      <FormContainer>
        {shouldRenderForm && (
          <UserForm data={data} onCancel={onCancel} onSubmitForm={onSubmitForm} readOnly={!userCanSubmitForm} />
        )}
      </FormContainer>
    </Fragment>
  );
};

export default UserDetail;
