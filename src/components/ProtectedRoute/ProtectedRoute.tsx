// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useMemo } from 'react'
import type { FunctionComponent } from 'react'

import { useSelector } from 'react-redux'
import type { RouteProps } from 'react-router-dom'

import NotFoundPage from 'components/pages/NotFoundPage'
import {
  makeSelectUserCan,
  makeSelectUserCanAccess,
} from 'containers/App/selectors'

export const NO_PAGE_ACCESS_MESSAGE = 'U heeft geen toegang tot deze pagina'
export const NO_PAGE_FOUND_MESSAGE = 'We hebben de pagina niet gevonden'

type ProtectedRouteProps = RouteProps & {
  role?: string
  roleGroup?: string
  component: (props: any) => JSX.Element | null
}

const ProtectedRoute: FunctionComponent<ProtectedRouteProps> = ({
  role,
  roleGroup,
  component: Component,
  ...rest
}) => {
  const userCan = useSelector(makeSelectUserCan)
  const userCanAccess = useSelector(makeSelectUserCanAccess)
  const hasAccess = useMemo(
    () => (role && userCan(role)) || (roleGroup && userCanAccess(roleGroup)),
    [role, roleGroup, userCan, userCanAccess]
  )
  if (!Component) return <NotFoundPage message={NO_PAGE_FOUND_MESSAGE} />

  return hasAccess ? (
    <Component {...rest} />
  ) : (
    <NotFoundPage message={NO_PAGE_ACCESS_MESSAGE} />
  )
}

export default ProtectedRoute
