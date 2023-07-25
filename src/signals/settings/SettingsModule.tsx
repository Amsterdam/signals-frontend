// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
/* istanbul ignore file */
import { useEffect, lazy, Suspense } from 'react'

import type { Location } from 'history'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'

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
  EXPORT_URL,
} from './routes'

// Not possible to properly test the async loading, setting coverage reporter to ignore lazy imports

const OverviewContainer = lazy(() => import('./components/Overview'))

const LoginPage = lazy(() => import('components/pages/LoginPage'))

const UsersOverviewContainer = lazy(() => import('./users/Overview'))

const RolesListContainer = lazy(
  () => import('./roles/containers/RolesListContainer')
)

const RoleFormContainer = lazy(
  () => import('./roles/containers/RoleFormContainer')
)

const UsersDetailContainer = lazy(() => import('./users/Detail'))

const DepartmentsOverviewContainer = lazy(
  () => import('./departments/Overview')
)

const DepartmentsDetailContainer = lazy(() => import('./departments/Detail'))

const SubcategoriesOverview = lazy(
  () => import('./categories/subcategories/Overview')
)

const MainCategoriesOverview = lazy(
  () => import('./categories/main-categories/Overview')
)

const SubcategoryDetail = lazy(
  () => import('./categories/subcategories/Detail')
)

const MainCategoryDetail = lazy(
  () => import('./categories/main-categories/Detail')
)

const ExportContainer = lazy(() => import('./export'))

const NotFoundPage = lazy(() => import('components/pages/NotFoundPage'))

const SettingsModule = () => {
  const storeDispatch = useDispatch()
  const location = useLocationReferrer() as Location
  const userCanAccess = useSelector(makeSelectUserCanAccess)
  const navigate = useNavigate()

  useEffect(() => {
    if (!getIsAuthenticated()) {
      return
    }

    storeDispatch(fetchRolesAction())
    storeDispatch(fetchPermissionsAction())
  }, [storeDispatch])

  useEffect(() => {
    if (userCanAccess('settings') === false) {
      navigate('/manage/incidents')
    }
    if (location.pathname === routes.users) {
      navigate(`${USERS_PAGED_URL}/1`)
    }

    if (location.pathname === routes.subcategories) {
      navigate(`${SUBCATEGORIES_PAGED_URL}/1`)
    }
  }, [location, navigate, userCanAccess])

  if (!getIsAuthenticated()) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    )
  }
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <Routes>
        <Route path={'/'} element={<OverviewContainer />} />
        <Route
          path={routes.roles}
          element={
            <ProtectedRoute component={RolesListContainer} roleGroup="groups" />
          }
        />
        <Route
          path={routes.role}
          element={
            <ProtectedRoute
              component={RoleFormContainer}
              roleGroup="groupForm"
            />
          }
        />
        <Route
          path={ROLE_URL}
          element={
            <ProtectedRoute component={RoleFormContainer} role="add_group" />
          }
        />
        <Route
          path={routes.users}
          element={<Navigate to={`${USERS_PAGED_URL}/1`} replace={true} />}
        />
        <Route
          path={routes.usersPaged}
          element={
            <ProtectedRoute
              component={UsersOverviewContainer}
              roleGroup="userForm"
            />
          }
        />
        <Route
          path={routes.user}
          element={
            <ProtectedRoute
              component={UsersDetailContainer}
              roleGroup="userForm"
            />
          }
        />
        <Route
          path={USER_URL}
          element={
            <ProtectedRoute component={UsersDetailContainer} role="add_user" />
          }
        />
        <Route
          path={routes.departments}
          element={
            <ProtectedRoute
              component={DepartmentsOverviewContainer}
              roleGroup="departments"
            />
          }
        />

        <Route
          path={routes.department}
          element={
            <ProtectedRoute
              component={DepartmentsDetailContainer}
              roleGroup="departmentForm"
            />
          }
        />
        <Route
          path={routes.subcategoriesPaged}
          element={
            <ProtectedRoute
              component={SubcategoriesOverview}
              roleGroup="categories"
            />
          }
        />
        <Route
          path={routes.subcategory}
          element={
            <ProtectedRoute
              component={SubcategoryDetail}
              roleGroup="categoryForm"
            />
          }
        />
        <Route
          path={routes.mainCategories}
          element={
            <ProtectedRoute
              component={MainCategoriesOverview}
              roleGroup="categories"
            />
          }
        />
        <Route
          path={routes.mainCategory}
          element={
            <ProtectedRoute
              component={MainCategoryDetail}
              roleGroup="categoryForm"
            />
          }
        />

        {configuration.featureFlags.enableCsvExport && (
          <Route
            path={EXPORT_URL}
            element={
              <ProtectedRoute
                component={ExportContainer}
                role="sia_signal_report"
              />
            }
          />
        )}
        <Route path={'*'} element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default SettingsModule
