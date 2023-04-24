// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
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
const RolesListContainer = lazy(
  () => import('./roles/containers/RolesListContainer')
)
// istanbul ignore next
const RoleFormContainer = lazy(
  () => import('./roles/containers/RoleFormContainer')
)
// istanbul ignore next
const UsersDetailContainer = lazy(() => import('./users/Detail'))
// istanbul ignore next
const DepartmentsOverviewContainer = lazy(
  () => import('./departments/Overview')
)
// istanbul ignore next
const DepartmentsDetailContainer = lazy(() => import('./departments/Detail'))

// istanbul ignore next
const SubcategoriesOverview = lazy(
  () => import('./categories/subcategories/Overview')
)
// istanbul ignore next
const MainCategoriesOverview = lazy(
  () => import('./categories/main-categories/Overview')
)
// istanbul ignore next
const SubcategoryDetail = lazy(
  () => import('./categories/subcategories/Detail')
)
// istanbul ignore next
const MainCategoryDetail = lazy(
  () => import('./categories/main-categories/Detail')
)

// istanbul ignore next
const ExportContainer = lazy(() => import('./export'))

// istanbul ignore next
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
              roleGroup="subcategories"
            />
          }
        />
        <Route
          path={routes.subcategory}
          element={
            <ProtectedRoute
              component={SubcategoryDetail}
              roleGroup="subcategoryForm"
            />
          }
        />
        <Route
          path={routes.mainCategories}
          element={
            <ProtectedRoute
              component={MainCategoriesOverview}
              roleGroup="mainCategories"
            />
          }
        />
        <Route
          path={routes.mainCategory}
          element={
            <ProtectedRoute
              component={MainCategoryDetail}
              roleGroup="mainCategoryForm"
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
        <Route path={BASE_URL} element={NotFoundPage} />
      </Routes>
    </Suspense>
  )
}

export default SettingsModule
