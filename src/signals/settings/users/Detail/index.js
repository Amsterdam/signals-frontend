// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React, { Fragment, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import isEqual from 'lodash.isequal';
import styled from 'styled-components';

import configuration from 'shared/services/configuration/configuration';
import { makeSelectUserCan } from 'containers/App/selectors';
import PageHeader from 'signals/settings/components/PageHeader';
import LoadingIndicator from 'components/LoadingIndicator';

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
  const { get: historyGet, data: historyData } = useFetch();
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

  useEffect(() => {
    if (userId) {
      get(`${configuration.USERS_ENDPOINT}${userId}`);
      historyGet(`${configuration.USERS_ENDPOINT}${userId}/history`);
    }
  }, [get, historyGet, userId]);

  const onSubmit = useCallback(
    formData => {
      if (isEqual(data, formData.form)) return;

      if (isExistingUser) {
        patch(`${configuration.USERS_ENDPOINT}${userId}`, formData.postPatch);
      } else {
        post(configuration.USERS_ENDPOINT, formData.postPatch);
      }
    },
    [data, isExistingUser, patch, post, userId]
  );

  const onCancel = useCallback(
    formData => {
      const isPristine = isEqual(data, formData.form);
      confirmedCancel(isPristine);
    },
    [data, confirmedCancel]
  );

  const title = `${entityName} ${isExistingUser ? 'wijzigen' : 'toevoegen'}`;

  return (
    <Fragment>
      <PageHeader title={title} BackLink={<BackLink to={redirectURL}>Terug naar overzicht</BackLink>} />

      {isLoading && <LoadingIndicator />}

      <FormContainer data-testid="userDetailFormContainer">
        {shouldRenderForm && (
          <UserForm
            data={data}
            history={historyData}
            onCancel={onCancel}
            onSubmit={onSubmit}
            readOnly={!userCanSubmitForm}
          />
        )}
      </FormContainer>
    </Fragment>
  );
};

export default UserDetail;
