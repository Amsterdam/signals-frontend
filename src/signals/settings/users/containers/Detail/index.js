import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Row, Column, themeSpacing } from '@datapunt/asc-ui';
import styled from 'styled-components';

import PageHeader from 'signals/settings/components/PageHeader';
import RadioButtonList from 'signals/incident-management/components/RadioButtonList';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import BackLink from 'components/BackLink';
import FormAlert from 'components/FormAlert';
import Input from 'components/Input';
import Label from 'components/Label';
import FormFooter from 'components/FormFooter';
import routes from '../../../routes';

import useFetchUser from './hooks/useFetchUser';

const Form = styled.form`
  width: 100%;
`;

const FieldGroup = styled.div`
  & + & {
    margin-top: ${themeSpacing(8)};
  }
`;

const StyledColumn = styled(Column)`
  flex-direction: column;
`;

const PageWrapper = styled.div`
  flex: 1;
  position: relative;
  padding-bottom: 66px;
`;

const statusOptions = [
  { key: 'true', value: 'Actief' },
  { key: 'false', value: 'Niet actief' },
];

const UserDetail = ({ location }) => {
  const { userId } = useParams();
  const { isLoading, error, data } = useFetchUser(userId);

  return (
    <PageWrapper>
      <PageHeader
        title="Gebruiker instellingen"
        BackLink={
          <BackLink to={location.referrer || routes.users}>
            Terug naar overzicht
          </BackLink>
        }
      />

      {isLoading && <LoadingIndicator />}

      {data && (
        <Form action="">
          <Row debug>
            <StyledColumn span={12}>
              {error && (
                <FormAlert
                  title="Gegevens konden niet opgehaald worden"
                  message={<span>error</span>}
                />
              )}
            </StyledColumn>

            <StyledColumn span={4}>
              <FieldGroup>
                <Input
                  defaultValue={data.email}
                  id="email"
                  name="email"
                  label="E-mailadres"
                  readOnly
                  disabled
                />
              </FieldGroup>

              <FieldGroup>
                <Input
                  defaultValue={data.first_name}
                  id="first_name"
                  name="first_name"
                  label="Voornaam"
                />
              </FieldGroup>

              <FieldGroup>
                <Input
                  defaultValue={data.last_name}
                  id="last_name"
                  name="last_name"
                  label="Achternaam"
                />
              </FieldGroup>

              <FieldGroup>
                <Label as="span">Status</Label>
                <RadioButtonList
                  defaultValue={data.is_active.toString()}
                  groupName="status"
                  hasEmptySelectionButton={false}
                  options={statusOptions}
                />
              </FieldGroup>
            </StyledColumn>

            <StyledColumn span={5} push={2}></StyledColumn>

            <StyledColumn span={12}>
              <FormFooter
                cancelBtnLabel="Annuleren"
                onCancel={() => {}}
                submitBtnLabel="Opslaan"
                onSubmitForm={() => {}}
              />
            </StyledColumn>
          </Row>
        </Form>
      )}
    </PageWrapper>
  );
};

UserDetail.propTypes = {
  location: PropTypes.shape({
    referrer: PropTypes.string,
  }).isRequired,
};

export default UserDetail;
