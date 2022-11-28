// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Suspense, useState } from 'react'

import LoadingIndicator from 'components/LoadingIndicator'
import type { Location } from 'history'
import useLocationReferrer from 'hooks/useLocationReferrer'
import { Redirect, Route, Switch } from 'react-router-dom'

import { MyIncidentsProvider } from '../../context/provider'
import { routes } from '../../definitions'
import {
  Confirmation,
  LinkExpired,
  RequestAccess,
  Overview,
  Detail,
} from '../../pages'
import type { MyIncident } from '../../types'

// istanbul ignore next
export const Routing = () => {
  const location = useLocationReferrer() as Location
  const [email, setEmail] = useState<string>()
  const [incidentsList, setIncidentsList] = useState<MyIncident[]>()

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <MyIncidentsProvider
        value={{
          email,
          setEmail,
          incidentsList,
          setIncidentsList,
        }}
      >
        <Switch location={location}>
          <Redirect exact from={routes.baseUrl} to={routes.requestAccess} />
          <Route exact path={routes.requestAccess} component={RequestAccess} />
          <Route exact path={routes.confirm} component={Confirmation} />
          <Route exact path={routes.expired} component={LinkExpired} />
          <Route exact path={`${routes.baseUrl}/:token`} component={Overview} />
          <Route
            exact
            path={routes.baseUrl + '/:token/:uuid'}
            component={Detail}
          />
        </Switch>
      </MyIncidentsProvider>
    </Suspense>
  )
}
