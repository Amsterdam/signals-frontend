import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import { isAuthenticated } from 'shared/services/auth/auth';

import LoginPage from 'components/LoginPage';
import NotFoundPage from 'containers/NotFoundPage';

import routes from './routes';
import UsersOverviewContainer from './users/containers/Overview';

export const SettingsModule = () => {
  if (!isAuthenticated()) {
    return <LoginPage />;
  }

  return (
    <Switch>
      {/* always redirect from /gebruikers to /gebruikers/page/1 to avoid having complexity in the UsersOverviewContainer component */}
      <Redirect
        exact
        from={routes.users}
        to={routes.usersPaged.replace(/:pageNum.*/, 1)}
      />
      <Route path={routes.usersPaged} component={UsersOverviewContainer} />
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default SettingsModule;
