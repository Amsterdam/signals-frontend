// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Suspense, useState } from 'react'

import { Navigate, Route, Routes } from 'react-router-dom'

import LoadingIndicator from 'components/LoadingIndicator'

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
        <Routes>
          <Route index element={<Navigate to={routes.requestAccess} />} />
          <Route path={routes.requestAccess} element={<RequestAccess />} />
          <Route path={routes.confirm} element={<Confirmation />} />
          <Route path={routes.expired} element={<LinkExpired />} />
          <Route path={`:token`} element={<Overview />} />
          <Route path={':token/:uuid'} element={<Detail />} />
        </Routes>
      </MyIncidentsProvider>
    </Suspense>
  )
}
