// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { useEffect, lazy, Suspense } from 'react'

import type { Location } from 'history'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'

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
    return <Route element={LoginPage} />
  }

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <Routes location={location}>
        <Route path={routes.overview} element={OverviewContainer} />
        <ProtectedRoute
          path={routes.roles}
          component={RolesListContainer}
          roleGroup="groups"
        />
        <ProtectedRoute
          path={routes.role}
          component={RoleFormContainer}
          roleGroup="groupForm"
        />
        <ProtectedRoute
          path={ROLE_URL}
          component={RoleFormContainer}
          role="add_group"
        />

        <ProtectedRoute
          path={routes.usersPaged}
          component={UsersOverviewContainer}
          roleGroup="userForm"
        />
        <ProtectedRoute
          path={routes.user}
          component={UsersDetailContainer}
          roleGroup="userForm"
        />
        <ProtectedRoute
          path={USER_URL}
          component={UsersDetailContainer}
          role="add_user"
        />

        <ProtectedRoute
          path={routes.departments}
          component={DepartmentsOverviewContainer}
          roleGroup="departments"
        />
        <ProtectedRoute
          path={routes.department}
          component={DepartmentsDetailContainer}
          roleGroup="departmentForm"
        />

        <ProtectedRoute
          path={routes.subcategoriesPaged}
          component={SubcategoriesOverview}
          roleGroup="subcategories"
        />
        <ProtectedRoute
          path={routes.subcategory}
          component={SubcategoryDetail}
          roleGroup="subcategoryForm"
        />

        <ProtectedRoute
          path={routes.mainCategories}
          component={MainCategoriesOverview}
          roleGroup="mainCategories"
        />
        <ProtectedRoute
          path={routes.mainCategory}
          component={MainCategoryDetail}
          roleGroup="mainCategoryForm"
        />

        {configuration.featureFlags.enableCsvExport && (
          <ProtectedRoute
            path={EXPORT_URL}
            component={ExportContainer}
            role="sia_signal_report"
          />
        )}

        <Route path={BASE_URL} element={NotFoundPage} />
      </Routes>
    </Suspense>
  )
}

export default SettingsModule
