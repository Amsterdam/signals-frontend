import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Switch, useLocation } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { isAuthenticated } from 'shared/services/auth/auth';

import LoginPage from 'components/LoginPage';
import {
  makeSelectUserCanAccess,
  makeSelectUserCan,
} from 'containers/App/selectors';

import { fetchRoles, fetchPermissions } from 'models/roles/actions';
import { fetchDepartments } from 'models/departments/actions';
import { fetchCategories } from 'models/categories/actions';

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
  fetchCategoriesAction,
  userCan,
  userCanAccess,
}) => {
  const moduleLocation = useLocation();
  const [location, setLocation] = useState(moduleLocation);

  const authenticatedUser = isAuthenticated();

  useEffect(() => {
    if (!authenticatedUser) {
      return;
    }

    onFetchDepartments();
    onFetchRoles();
    onFetchPermissions();
    fetchCategoriesAction();
  }, [
    onFetchDepartments,
    onFetchPermissions,
    onFetchRoles,
    fetchCategoriesAction,
    authenticatedUser,
  ]);

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

  if (!authenticatedUser) {
    return <Route component={LoginPage} />;
  }

  if (userCanAccess('settings') === false) {
    return <Redirect to="/manage/incidents" />;
  }

  return (
    <Fragment>
      {userCanAccess('groups') && (
        <Switch location={location}>
          <Route exact path={routes.roles} component={RolesListContainer} />

          {userCanAccess('groupForm') && (
            <Route exact path={routes.role} component={RoleFormContainer} />
          )}
          {userCan('add_group') && (
            <Route exact path={ROLE_URL} component={RoleFormContainer} />
          )}
        </Switch>
      )}

      {userCanAccess('users') && (
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

          {userCanAccess('userForm') && (
            <Route exact path={routes.user} component={UsersDetailContainer} />
          )}
          {userCan('add_user') && (
            <Route exact path={USER_URL} component={UsersDetailContainer} />
          )}
        </Switch>
      )}

      {userCanAccess('departments') && (
        <Switch location={location}>
          <Route
            exact
            path={routes.departments}
            component={DepartmentsOverviewContainer}
          />

          {userCanAccess('departmentForm') && (
            <Route
              exact
              path={routes.department}
              component={DepartmentsDetailContainer}
            />
          )}
        </Switch>
      )}
    </Fragment>
  );
};

SettingsModule.propTypes = {
  fetchCategoriesAction: PropTypes.func.isRequired,
  onFetchDepartments: PropTypes.func.isRequired,
  onFetchPermissions: PropTypes.func.isRequired,
  onFetchRoles: PropTypes.func.isRequired,
  userCan: PropTypes.func.isRequired,
  userCanAccess: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userCan: makeSelectUserCan,
  userCanAccess: makeSelectUserCanAccess,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchCategoriesAction: fetchCategories,
      onFetchDepartments: fetchDepartments,
      onFetchPermissions: fetchPermissions,
      onFetchRoles: fetchRoles,
    },
    dispatch
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect(SettingsModule);
