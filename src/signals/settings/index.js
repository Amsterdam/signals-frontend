// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { useEffect, lazy, Suspense } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getIsAuthenticated } from 'shared/services/auth/auth'
import ProtectedRoute from 'components/ProtectedRoute'

import { makeSelectUserCanAccess } from 'containers/App/selectors'

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

// Not possible to properly test the async loading, setting coverage reporter to ignore lazy imports
// istanbul ignore next
const OverviewContainer = lazy(() => import('./components/Overview'))
// istanbul ignore next
const LoginPage = lazy(() => import('components/pages/LoginPage'))
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
const NotFoundPage = lazy(() => import('components/pages/NotFoundPage'))

const SettingsModule = () => {
  const storeDispatch = useDispatch()
  const location = useLocationReferrer()
  const userCanAccess = useSelector(makeSelectUserCanAccess)

  useEffect(() => {
    if (!getIsAuthenticated()) {
      return
    }

    storeDispatch(fetchRolesAction())
    storeDispatch(fetchPermissionsAction())
  }, [storeDispatch])

  if (!getIsAuthenticated()) {
    return <Route component={LoginPage} />
  }

  if (userCanAccess('settings') === false) {
    return <Redirect to="/manage/incidents" />
  }

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <Switch location={location}>
        <Route exact path={routes.overview} component={OverviewContainer} />
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
  )
}

export default SettingsModule
