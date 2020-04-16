import React, { memo, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Switch } from 'react-router-dom';
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
import useLocationReferrer from 'hooks/useLocationReferrer';
import { fetchCategories } from 'models/categories/actions';

import routes, {
  USERS_PAGED_URL,
  USER_URL,
  ROLE_URL,
  CATEGORIES_PAGED_URL,
  CATEGORY_URL,
} from './routes';
import UsersOverviewContainer from './users/Overview';
import RolesListContainer from './roles/containers/RolesListContainer';
import RoleFormContainer from './roles/containers/RoleFormContainer';
import UsersDetailContainer from './users/Detail';
import DepartmentsOverviewContainer from './departments/Overview';
import DepartmentsDetailContainer from './departments/Detail';
import CategoriesOverviewContainer from './categories/Overview';
import CategoryDetailContainer from './categories/Detail';

import SettingsContext from './context';
import reducer, { initialState } from './reducer';

export const SettingsModule = ({
  onFetchDepartments,
  onFetchPermissions,
  onFetchRoles,
  fetchCategoriesAction,
  userCan,
  userCanAccess,
}) => {
  const location = useLocationReferrer();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!isAuthenticated()) {
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
  ]);

  if (!isAuthenticated()) {
    return <Route component={LoginPage} />;
  }

  if (userCanAccess('settings') === false) {
    return <Redirect to="/manage/incidents" />;
  }

  return (
    <SettingsContext.Provider value={{ state, dispatch }}>
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

      {userCanAccess('categories') && (
        <Switch location={location}>
          {/*
           * always redirect from /gebruikers to /gebruikers/page/1 to avoid having complexity
           * in the UsersOverviewContainer component
           */}
          <Redirect
            exact
            from={routes.categories}
            to={`${CATEGORIES_PAGED_URL}/1`}
          />
          <Route
            exact
            path={routes.categoriesPaged}
            component={CategoriesOverviewContainer}
          />

          {userCanAccess('categoryForm') && (
            <Route
              exact
              path={routes.category}
              component={CategoryDetailContainer}
            />
          )}
          {userCan('add_category') && (
            <Route
              exact
              path={CATEGORY_URL}
              component={CategoryDetailContainer}
            />
          )}
        </Switch>
      )}
    </SettingsContext.Provider>
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

export default memo(withConnect(SettingsModule));
