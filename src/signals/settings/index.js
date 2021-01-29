import React, { useEffect, useReducer, lazy, Suspense, useMemo } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { isAuthenticated } from 'shared/services/auth/auth';

import { makeSelectUserCanAccess, makeSelectUserCan } from 'containers/App/selectors';

import { fetchRoles as fetchRolesAction, fetchPermissions as fetchPermissionsAction } from 'models/roles/actions';
import useLocationReferrer from 'hooks/useLocationReferrer';
import LoadingIndicator from 'components/LoadingIndicator';

import routes, { USERS_PAGED_URL, USER_URL, ROLE_URL, CATEGORIES_PAGED_URL, CATEGORY_URL } from './routes';

import SettingsContext from './context';
import reducer, { initialState } from './reducer';

// Not possible to properly test the async loading, setting coverage reporter to ignore lazy imports
// istanbul ignore next
const LoginPage = lazy(() => import('components/LoginPage'));
// istanbul ignore next
const UsersOverviewContainer = lazy(() => import('./users/Overview'));
// istanbul ignore next
const RolesListContainer = lazy(() => import('./roles/containers/RolesListContainer'));
// istanbul ignore next
const RoleFormContainer = lazy(() => import('./roles/containers/RoleFormContainer'));
// istanbul ignore next
const UsersDetailContainer = lazy(() => import('./users/Detail'));
// istanbul ignore next
const DepartmentsOverviewContainer = lazy(() => import('./departments/Overview'));
// istanbul ignore next
const DepartmentsDetailContainer = lazy(() => import('./departments/Detail'));
// istanbul ignore next
const CategoriesOverviewContainer = lazy(() => import('./categories/Overview'));
// istanbul ignore next
const CategoryDetailContainer = lazy(() => import('./categories/Detail'));

const SettingsModule = () => {
  const storeDispatch = useDispatch();
  const location = useLocationReferrer();
  const [state, dispatch] = useReducer(reducer, initialState);
  const userCan = useSelector(makeSelectUserCan);
  const userCanAccess = useSelector(makeSelectUserCanAccess);
  const contextValue = useMemo(() => ({ state, dispatch }), [state]);

  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    storeDispatch(fetchRolesAction());
    storeDispatch(fetchPermissionsAction());
  }, [storeDispatch]);

  if (!isAuthenticated()) {
    return <Route component={LoginPage} />;
  }

  if (userCanAccess('settings') === false) {
    return <Redirect to="/manage/incidents" />;
  }


  return (
    <SettingsContext.Provider value={contextValue}>
      <Suspense fallback={<LoadingIndicator />}>
        {userCanAccess('groups') && (
          <Switch location={location}>
            <Route exact path={routes.roles} component={RolesListContainer} />

            {userCanAccess('groupForm') && <Route exact path={routes.role} component={RoleFormContainer} />}
            {userCan('add_group') && <Route exact path={ROLE_URL} component={RoleFormContainer} />}
          </Switch>
        )}

        {userCanAccess('users') && (
          <Switch location={location}>
            {/*
             * always redirect from /gebruikers to /gebruikers/page/1 to avoid having complexity
             * in the UsersOverviewContainer component
             */}
            <Redirect exact from={routes.users} to={`${USERS_PAGED_URL}/1`} />
            <Route exact path={routes.usersPaged} component={UsersOverviewContainer} />

            {userCanAccess('userForm') && <Route exact path={routes.user} component={UsersDetailContainer} />}
            {userCan('add_user') && <Route exact path={USER_URL} component={UsersDetailContainer} />}
          </Switch>
        )}

        {userCanAccess('departments') && (
          <Switch location={location}>
            <Route exact path={routes.departments} component={DepartmentsOverviewContainer} />

            {userCanAccess('departmentForm') && (
              <Route exact path={routes.department} component={DepartmentsDetailContainer} />
            )}
          </Switch>
        )}

        {userCanAccess('categories') && (
          <Switch location={location}>
            {/*
             * always redirect from /gebruikers to /gebruikers/page/1 to avoid having complexity
             * in the UsersOverviewContainer component
             */}
            <Redirect exact from={routes.categories} to={`${CATEGORIES_PAGED_URL}/1`} />
            <Route exact path={routes.categoriesPaged} component={CategoriesOverviewContainer} />

            {userCanAccess('categoryForm') && (
              <Route exact path={routes.category} component={CategoryDetailContainer} />
            )}
            {userCan('add_category') && <Route exact path={CATEGORY_URL} component={CategoryDetailContainer} />}
          </Switch>
        )}
      </Suspense>
    </SettingsContext.Provider>
  );
};

export default SettingsModule;
