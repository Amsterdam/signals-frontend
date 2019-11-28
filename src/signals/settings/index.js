import React, { useEffect, useState } from 'react';
import { Route, Redirect, Switch, useLocation } from 'react-router-dom';

import { isAuthenticated } from 'shared/services/auth/auth';

import LoginPage from 'components/LoginPage';
import NotFoundPage from 'containers/NotFoundPage';

import routes from './routes';
import UsersOverviewContainer from './users/containers/Overview';
import UsersDetailContainer from './users/containers/Detail';
import RolesOverviewContainer from './roles/containers/RolesOverview';

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
  }, [setLocation, location.pathname, moduleLocation]);

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
        to={routes.usersPaged.replace(/:pageNum.*/, 1)}
      />
      <Route
        exact
        path={routes.usersPaged}
        component={UsersOverviewContainer}
      />
      <Route exact path={routes.user} component={UsersDetailContainer} />
      <Route path={routes.roles} component={RolesOverviewContainer} />
      <Route path={routes.rol} component={RolesOverviewContainer} />
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default SettingsModule;
