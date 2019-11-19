import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Row, Column } from '@datapunt/asc-ui';

import PageHeader from 'signals/settings/components/PageHeader';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import BackLink from 'components/BackLink';
import FormAlert from 'components/FormAlert';
import routes from '../../../routes';

import useFetchUser from './hooks/useFetchUser';

const UserDetail = ({ location }) => {
  const { userId } = useParams();
  const { isLoading, error, data } = useFetchUser(userId);

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
        {error && (
          <Column span={12}>
            <FormAlert title="Gegevens konden niet opgehaald worden" message={<span>error</span>} />
          </Column>
        )}
        <Column span={5}>
          {data && (
            <Fragment>
              E-mail: {data.email}
              <br />
              Voornaam: {data.first_name}
              <br />
              Achternaam: {data.last_name}
              <br />
              Gebruikersnaam: {data.username}
            </Fragment>
          )}
        </Column>
        <Column span={7}></Column>
      </Row>
    </Fragment>
  );
};

UserDetail.propTypes = {
  location: PropTypes.shape({
    referrer: PropTypes.string,
  }).isRequired,
};

export default UserDetail;
