import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import { isAuthenticated } from 'shared/services/auth/auth';

import LoginPage from 'components/LoginPage';

import routes from './routes';
import UsersOverviewContainer from './users/containers/Overview';

export const SettingsModule = () =>
  !isAuthenticated() ? (
    <Route component={LoginPage} />
  ) : (
    <Fragment>
      <Route
        exact
        path={routes.users}
        component={UsersOverviewContainer}
      />
      <Route
        exact
        path={routes.usersPaged}
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
