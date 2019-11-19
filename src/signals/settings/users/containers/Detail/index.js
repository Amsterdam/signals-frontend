import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Column } from '@datapunt/asc-ui';

import PageHeader from 'signals/settings/components/PageHeader';
import BackLink from 'components/BackLink';
import routes from '../../../routes';

const UserDetail = ({ location }) => (
  <Fragment>
    <PageHeader
      title="Gebruiker instellingen"
      BackLink={
        <BackLink to={location.referrer || routes.users}>
          Terug naar overzicht
        </BackLink>
      }
    />

    <Row>
      <Column span={5}></Column>
      <Column span={7}></Column>
    </Row>
  </Fragment>
);

UserDetail.propTypes = {
  location: PropTypes.shape({
    referrer: PropTypes.string,
  }).isRequired,
};

export default UserDetail;
