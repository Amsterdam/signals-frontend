import React, { Fragment, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { Row, Column } from '@datapunt/asc-ui';
import isEqual from 'lodash.isequal';
import styled from 'styled-components';

import {
  VARIANT_ERROR,
  VARIANT_SUCCESS,
  TYPE_LOCAL,
} from 'containers/Notification/constants';
import PageHeader from 'signals/settings/components/PageHeader';
import LoadingIndicator from 'shared/components/LoadingIndicator';

import { showGlobalNotification as showGlobalNotificationAction } from 'containers/App/actions';
import BackLink from 'components/BackLink';
import routes from 'signals/settings/routes';

import useFetchUser from './hooks/useFetchUser';
import UserForm from './components/UserForm';

const FormContainer = styled(Row)`
  // taking into account the space that the FormFooter component takes up
  padding-bottom: 66px;
`;

const StyledColumn = styled(Column)`
  flex-direction: column;
`;

export const UserDetailContainerComponent = ({ showGlobalNotification }) => {
  const { userId } = useParams();
  const location = useLocation();
  const history = useHistory();
  const isExistingUser = userId !== undefined;
  const { isLoading, isSuccess, error, data, patch, post } = useFetchUser(
    userId
  );
  const shouldRenderForm = !isExistingUser || (isExistingUser && Boolean(data));
  const redirectURL = location.referrer || routes.users;

  const getFormData = useCallback(
    e =>
      [...new FormData(e.target.form).entries()]
        // convert stringified boolean values to actual booleans
        .map(([key, val]) => [key, key === 'is_active' ? val === 'true' : val])
        // reduce the entries() array to an object, merging it with the initial data
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), { ...data }),
    [data]
  );

  useEffect(() => {
    if (isLoading) return;

    let message;
    let variant = VARIANT_SUCCESS;

    if (error) {
      ({ message } = error);
      variant = VARIANT_ERROR;
    }

    if (!isExistingUser && isSuccess) {
      message = 'Gebruiker toegevoegd';
    }

    if (isExistingUser && isSuccess) {
      message = 'Gegevens opgeslagen';
    }

    if (!message) return;

    showGlobalNotification({
      variant,
      title: message,
      type: TYPE_LOCAL,
    });

    if (isSuccess) {
      history.push(redirectURL);
    }
  }, [
    error,
    isExistingUser,
    isLoading,
    isSuccess,
    history,
    showGlobalNotification,
    redirectURL,
  ]);

  const onSubmitForm = useCallback(
    e => {
      e.preventDefault();

      const formData = getFormData(e);

      if (isEqual(data, formData)) {
        return;
      }

      if (isExistingUser) {
        patch(formData);
      } else {
        post(formData);
      }
    },
    [data, getFormData, patch, isExistingUser, post]
  );

  const onCancel = useCallback(
    e => {
      const formData = getFormData(e);

      if (
        isEqual(data, formData) ||
        (!isEqual(data, formData) &&
          global.confirm('Niet opgeslagen gegevens gaan verloren. Doorgaan?'))
      ) {
        history.push(redirectURL);
      }
    },
    [data, getFormData, history, redirectURL]
  );

  const title = useMemo(
    () => `Gebruiker ${isExistingUser ? 'wijzigen' : 'toevoegen'}`,
    [isExistingUser]
  );

  return (
    <Fragment>
      <PageHeader
        title={title}
        BackLink={<BackLink to={redirectURL}>Terug naar overzicht</BackLink>}
      />

      {isLoading && <LoadingIndicator />}

      <FormContainer>
        <StyledColumn
          span={{ small: 1, medium: 2, big: 4, large: 5, xLarge: 4 }}
        >
          {shouldRenderForm && (
            <UserForm
              data={data}
              onCancel={onCancel}
              onSubmitForm={onSubmitForm}
            />
          )}
        </StyledColumn>
      </FormContainer>
    </Fragment>
  );
};

UserDetailContainerComponent.propTypes = {
  showGlobalNotification: PropTypes.func.isRequired,
};

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showGlobalNotification: showGlobalNotificationAction,
    },
    dispatch
  );

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(UserDetailContainerComponent);
