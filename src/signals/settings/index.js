import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Switch } from 'react-router-dom';

import { isAuthenticated } from 'shared/services/auth/auth';

import LoginPage from 'components/LoginPage';

import routes from './routes';
import UsersOverviewContainer from './users/containers/Overview';

export const SettingsModule = () =>
  !isAuthenticated() ? (
    <Route component={LoginPage} />
  ) : (
    <Switch>
      <Redirect
        exact
        from={routes.users}
        to={routes.usersPaged.replace(':pageNum', 1)}
      />
      <Route
        exact
        path={routes.usersPaged}
        component={UsersOverviewContainer}
      />
    </Switch>
  );

SettingsModule.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }),
};

export default SettingsModule;
