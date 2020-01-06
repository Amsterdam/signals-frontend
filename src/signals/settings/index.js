import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Switch, useLocation } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isAuthenticated } from 'shared/services/auth/auth';

import LoginPage from 'components/LoginPage';
import NotFoundPage from 'components/NotFoundPage';

import { fetchRoles, fetchPermissions } from 'models/roles/actions';
import { fetchDepartments } from 'models/departments/actions';

import routes, { USERS_PAGED_URL, USER_URL, ROLE_URL } from './routes';
import UsersOverviewContainer from './users/containers/Overview';
import RolesListContainer from './roles/containers/RolesListContainer';
import RoleFormContainer from './roles/containers/RoleFormContainer';
import UsersDetailContainer from './users/containers/Detail';
import DepartmentsOverviewContainer from './departments/Overview';
import DepartmentsDetailContainer from './departments/Detail';

export const SettingsModule = ({
  onFetchDepartments,
  onFetchPermissions,
  onFetchRoles,
}) => {
  const moduleLocation = useLocation();
  const [location, setLocation] = useState(moduleLocation);

  useEffect(() => {
    onFetchDepartments();
    onFetchRoles();
    onFetchPermissions();
  }, [onFetchDepartments, onFetchPermissions, onFetchRoles]);

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
      <Redirect exact from={routes.users} to={`${USERS_PAGED_URL}/1`} />
      <Route
        exact
        path={routes.usersPaged}
        component={UsersOverviewContainer}
      />
      <Route exact path={routes.user} component={UsersDetailContainer} />
      <Route exact path={USER_URL} component={UsersDetailContainer} />
      <Route exact path={routes.roles} component={RolesListContainer} />
      <Route exact path={routes.role} component={RoleFormContainer} />
      <Route exact path={ROLE_URL} component={RoleFormContainer} />

      <Route
        exact
        path={routes.departments}
        component={DepartmentsOverviewContainer}
      />
      <Route
        exact
        path={routes.department}
        component={DepartmentsDetailContainer}
      />
      <Route component={NotFoundPage} />
    </Switch>
  );
};

SettingsModule.propTypes = {
  onFetchDepartments: PropTypes.func.isRequired,
  onFetchPermissions: PropTypes.func.isRequired,
  onFetchRoles: PropTypes.func.isRequired,
};

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onFetchDepartments: fetchDepartments,
      onFetchPermissions: fetchPermissions,
      onFetchRoles: fetchRoles,
    },
    dispatch
  );

const withConnect = connect(null, mapDispatchToProps);

export default withConnect(SettingsModule);
