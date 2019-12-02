import React, { Fragment, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { Row, Column } from '@datapunt/asc-ui';
import isEqual from 'lodash.isequal';
import styled from 'styled-components';

import PageHeader from 'signals/settings/components/PageHeader';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import BackLink from 'components/BackLink';
import FormAlert from 'components/FormAlert';
import routes, { USER_URL } from '../../../routes';

import useFetchUser from './hooks/useFetchUser';
import UserForm from './components/UserForm';

const FormContainer = styled(Row)`
  // taking into account the space that the FormFooter component takes up
  padding-bottom: 66px;
`;

const StyledColumn = styled(Column)`
  flex-direction: column;
`;

const UserDetail = () => {
  const { userId } = useParams();
  const location = useLocation();
  const history = useHistory();
  const isExistingUser = userId !== undefined;
  const { isLoading, isSuccess, error, data, patch, post } = useFetchUser(
    userId
  );
  const shouldRenderForm = !isExistingUser || (isExistingUser && Boolean(data));

  useEffect(() => {
    if (!isExistingUser && isSuccess) {
      history.replace(`${USER_URL}/${data.id}`);
    }
  }, [isExistingUser, isSuccess]);

  const getFormData = e =>
    [...new FormData(e.target.form).entries()]
      // convert stringified boolean values to actual booleans
      .map(([key, val]) => [key, key === 'is_active' ? val === 'true' : val])
      // reduce the entries() array to an object, merging it with the initial data
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), { ...data });

  const onSubmitForm = e => {
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
  };

  const onCancel = e => {
    const formData = getFormData(e);

    if (
      isEqual(data, formData) ||
      (!isEqual(data, formData) &&
        global.confirm('Niet opgeslagen gegevens gaan verloren. Doorgaan?'))
    ) {
      history.push(location.referrer || routes.users);
    }
  };

  return (
    <Fragment>
      <PageHeader
        title="Gebruiker instellingen"
        BackLink={
          <BackLink to={location.referrer || routes.users}>
            Terug naar overzicht
          </BackLink>
        }
      />

      {isLoading && <LoadingIndicator />}

      <Row>
        <Column span={12}>
          {!isLoading && error && <FormAlert title={error.message} />}

          {!isLoading && isSuccess && (
            <FormAlert isNotification title="Gegevens opgeslagen" />
          )}
        </Column>
      </Row>

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

export default UserDetail;
