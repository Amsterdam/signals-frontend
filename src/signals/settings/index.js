import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import { isAuthenticated } from 'shared/services/auth/auth';

import LoginPage from 'components/LoginPage';

import UsersOverviewContainer from './users/containers/Overview';

export const SettingsModule = ({ match: { url } }) =>
  !isAuthenticated() ? (
    <Route component={LoginPage} />
  ) : (
    <Route
      exact
      path={`${url}/gebruikers`}
      component={UsersOverviewContainer}
    />
  );

SettingsModule.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }),
};

export default SettingsModule;
