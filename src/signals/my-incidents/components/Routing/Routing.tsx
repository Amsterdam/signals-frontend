// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Suspense, useEffect, useState } from 'react'

import { Route, Routes, useNavigate } from 'react-router-dom'

import LoadingIndicator from 'components/LoadingIndicator'
import useLocationReferrer from 'hooks/useLocationReferrer'

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
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === '/mijn-meldingen') {
      navigate(routes.requestAccess)
    }
  }, [location.pathname, navigate])

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
