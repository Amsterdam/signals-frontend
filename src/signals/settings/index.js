import React, { useEffect, useState } from 'react';
import { Route, Redirect, Switch, useLocation } from 'react-router-dom';

import { isAuthenticated } from 'shared/services/auth/auth';

import LoginPage from 'components/LoginPage';
import NotFoundPage from 'components/NotFoundPage';

import routes, { USERS_PAGED_URL, USER_URL } from './routes';
import UsersOverviewContainer from './users/containers/Overview';
import RolesListContainer from './roles/containers/RolesListContainer';
import RoleFormContainer from './roles/containers/RoleFormContainer';
import UsersDetailContainer from './users/containers/Detail';

export const SettingsModule = () => {
  const moduleLocation = useLocation();
  const [location, setLocation] = useState(moduleLocation);

  // subscribe to updates and set the referrer when page URLs differ
  useEffect(() => {
    if (location.pathname !== moduleLocation.pathname) {
      const locWithReferrer = {
        ...moduleLocation,
        referrer: location.pathname,
      };

      setLocation(locWithReferrer);
    }
  }, [location.pathname, moduleLocation, setLocation]);

  if (!isAuthenticated()) {
    return <Route component={LoginPage} />;
  }

  return (
    <Switch location={location}>
      {/*
       * always redirect from /gebruikers to /gebruikers/page/1 to avoid having complexity
       * in the UsersOverviewContainer component
       */}
      <Redirect
        exact
        from={routes.users}
        to={`${USERS_PAGED_URL}/1`}
      />
      <Route
        exact
        path={routes.usersPaged}
        component={UsersOverviewContainer}
      />
      <Route exact path={routes.user} component={UsersDetailContainer} />
      <Route exact path={USER_URL} component={UsersDetailContainer} />
      <Route exact path={routes.roles} component={RolesListContainer} />
      <Route exact path={routes.role} component={RoleFormContainer} />
      <Route component={NotFoundPage} />
    </Switch >
  );
};

export default SettingsModule;
