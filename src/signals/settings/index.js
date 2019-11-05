import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import { isAuthenticated } from 'shared/services/auth/auth';

import LoginPage from 'components/LoginPage';

import UsersOverviewContainer from './users/containers/Overview';

export const SettingsModule = ({ match: { url } }) =>
  !isAuthenticated() ? (
    <Route component={LoginPage} />
  ) : (
    <Fragment>
      <Route
        exact
        path={`${url}/gebruikers`}
        component={UsersOverviewContainer}
      />
      <Route
        exact
        path={`${url}/gebruikers/page/:pageNum?`}
        component={UsersOverviewContainer}
      />
    </Fragment>
  );

SettingsModule.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }),
};

export default SettingsModule;
