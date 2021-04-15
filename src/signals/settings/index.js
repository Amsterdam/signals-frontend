// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React, { useEffect, useReducer, lazy, Suspense, useMemo } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { isAuthenticated } from 'shared/services/auth/auth'
import ProtectedRoute from 'components/ProtectedRoute'

import {
  makeSelectUserCanAccess,
  makeSelectUserCan,
} from 'containers/App/selectors'

import {
  fetchRoles as fetchRolesAction,
  fetchPermissions as fetchPermissionsAction,
} from 'models/roles/actions'
import useLocationReferrer from 'hooks/useLocationReferrer'
import LoadingIndicator from 'components/LoadingIndicator'

import routes, {
  USERS_PAGED_URL,
  USER_URL,
  ROLE_URL,
  CATEGORIES_PAGED_URL,
  CATEGORY_URL,
  BASE_URL,
} from './routes'

import SettingsContext from './context'
import reducer, { initialState } from './reducer'

// Not possible to properly test the async loading, setting coverage reporter to ignore lazy imports
// istanbul ignore next
const LoginPage = lazy(() => import('components/LoginPage'))
// istanbul ignore next
const UsersOverviewContainer = lazy(() => import('./users/Overview'))
// istanbul ignore next
const RolesListContainer = lazy(() =>
  import('./roles/containers/RolesListContainer')
)
// istanbul ignore next
const RoleFormContainer = lazy(() =>
  import('./roles/containers/RoleFormContainer')
)
// istanbul ignore next
const UsersDetailContainer = lazy(() => import('./users/Detail'))
// istanbul ignore next
const DepartmentsOverviewContainer = lazy(() =>
  import('./departments/Overview')
)
// istanbul ignore next
const DepartmentsDetailContainer = lazy(() => import('./departments/Detail'))
// istanbul ignore next
const CategoriesOverviewContainer = lazy(() => import('./categories/Overview'))
// istanbul ignore next
const CategoryDetailContainer = lazy(() => import('./categories/Detail'))
// istanbul ignore next
const NotFoundPage = lazy(() => import('components/NotFoundPage'))

const SettingsModule = () => {
  const storeDispatch = useDispatch()
  const location = useLocationReferrer()
  const [state, dispatch] = useReducer(reducer, initialState)
  const userCan = useSelector(makeSelectUserCan)
  const userCanAccess = useSelector(makeSelectUserCanAccess)
  const contextValue = useMemo(() => ({ state, dispatch }), [state])

  useEffect(() => {
    if (!isAuthenticated()) {
      return
    }

    storeDispatch(fetchRolesAction())
    storeDispatch(fetchPermissionsAction())
  }, [storeDispatch])

  if (!isAuthenticated()) {
    return <Route component={LoginPage} />
  }

  if (userCanAccess('settings') === false) {
    return <Redirect to="/manage/incidents" />
  }

  return (
    <SettingsContext.Provider value={contextValue}>
      <Suspense fallback={<LoadingIndicator />}>
        <Switch location={location}>
          <ProtectedRoute
            exact
            path={routes.roles}
            component={RolesListContainer}
            roleGroup="groups"
          />
          <ProtectedRoute
            exact
            path={routes.role}
            component={RoleFormContainer}
            roleGroup="groupForm"
          />
          <ProtectedRoute
            exact
            path={ROLE_URL}
            component={RoleFormContainer}
            role="add_group"
          />

          <Redirect exact from={routes.users} to={`${USERS_PAGED_URL}/1`} />
          <ProtectedRoute
            exact
            path={routes.usersPaged}
            component={UsersOverviewContainer}
            roleGroup="userForm"
          />
          <ProtectedRoute
            exact
            path={routes.user}
            component={UsersDetailContainer}
            roleGroup="userForm"
          />
          <ProtectedRoute
            exact
            path={USER_URL}
            component={UsersDetailContainer}
            role="add_user"
          />

          <ProtectedRoute
            exact
            path={routes.departments}
            component={DepartmentsOverviewContainer}
            roleGroup="departments"
          />
          <ProtectedRoute
            exact
            path={routes.department}
            component={DepartmentsDetailContainer}
            roleGroup="departmentForm"
          />

          <Redirect
            exact
            from={routes.categories}
            to={`${CATEGORIES_PAGED_URL}/1`}
          />
          <ProtectedRoute
            exact
            path={routes.categoriesPaged}
            component={CategoriesOverviewContainer}
            roleGroup="categories"
          />
          <ProtectedRoute
            exact
            path={routes.category}
            component={CategoryDetailContainer}
            roleGroup="categoryForm"
          />
          <ProtectedRoute
            exact
            path={CATEGORY_URL}
            component={CategoryDetailContainer}
            role="add_category"
          />
          <Route path={BASE_URL} component={NotFoundPage} />
        </Switch>
      </Suspense>
    </SettingsContext.Provider>
  )
}

export default SettingsModule
