// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { useEffect, lazy, Suspense } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Route, Redirect, Switch } from 'react-router-dom'

import LoadingIndicator from 'components/LoadingIndicator'
import ProtectedRoute from 'components/ProtectedRoute'
import { makeSelectUserCanAccess } from 'containers/App/selectors'
import useLocationReferrer from 'hooks/useLocationReferrer'
import {
  fetchRoles as fetchRolesAction,
  fetchPermissions as fetchPermissionsAction,
} from 'models/roles/actions'
import { getIsAuthenticated } from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'

import routes, {
  USERS_PAGED_URL,
  USER_URL,
  ROLE_URL,
  SUBCATEGORIES_PAGED_URL,
  CATEGORY_URL,
  BASE_URL,
  EXPORT_URL,
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
const SubcategoriesOverview = lazy(() => import('./categories'))
// istanbul ignore next
const CategoryDetailContainer = lazy(() => import('./categories/subcategories'))

// istanbul ignore next
const ExportContainer = lazy(() => import('./export'))

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
          from={routes.subcategories}
          to={`${SUBCATEGORIES_PAGED_URL}/1`}
        />
        <ProtectedRoute
          exact
          path={routes.subcategoriesPaged}
          component={SubcategoriesOverview}
          roleGroup="subcategories"
        />
        <ProtectedRoute
          exact
          path={routes.categories}
          component={SubcategoriesOverview}
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

        {configuration.featureFlags.enableCsvExport && (
          <ProtectedRoute
            exact
            path={EXPORT_URL}
            component={ExportContainer}
            role="sia_signal_report"
          />
        )}

        <Route path={BASE_URL} component={NotFoundPage} />
      </Switch>
    </Suspense>
  )
}

export default SettingsModule
