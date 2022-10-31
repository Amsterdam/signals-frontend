// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Suspense } from 'react'

import type { Location } from 'history'
import { Redirect, Route, Switch } from 'react-router-dom'

import LoadingIndicator from 'components/LoadingIndicator'
import useLocationReferrer from 'hooks/useLocationReferrer'

import { MyIncidentsProvider } from '../context'
import { routes } from '../definitions'
import { useMyIncident } from '../hooks'
import { Confirmation, LinkExpired, RequestAccess } from '../pages'

export const Routing = () => {
  const location = useLocationReferrer() as Location
  const value = useMyIncident()

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <MyIncidentsProvider value={value}>
        <Switch location={location}>
          <Redirect exact from={routes.baseUrl} to={routes.requestAccess} />
          <Route exact path={routes.requestAccess} component={RequestAccess} />
          <Route exact path={routes.confirm} component={Confirmation} />
          <Route exact path={routes.expired} component={LinkExpired} />
        </Switch>
      </MyIncidentsProvider>
    </Suspense>
  )
}
