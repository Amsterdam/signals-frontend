// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import { compose } from 'redux'

import LoadingIndicator from 'components/LoadingIndicator'
import { makeSelectSearchQuery } from 'containers/App/selectors'
import { getIsAuthenticated } from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'

import {
  getDistricts,
  getFilters,
  requestIncidents,
  searchIncidents,
} from './actions'
import IncidentManagementContext from './context'
import reducer from './reducer'
import routes from './routes'
import saga from './saga'
import { makeSelectDistricts } from './selectors'

// Not possible to properly test the async loading, setting coverage reporter to ignore lazy imports
// istanbul ignore next
const LoginPage = lazy(() => import('components/pages/LoginPage'))
// istanbul ignore next
const IncidentOverviewPage = lazy(() =>
  import('./containers/IncidentOverviewPage')
)
// istanbul ignore next
const IncidentDetail = lazy(() => import('./containers/IncidentDetail'))
// istanbul ignore next
const DefaultTextsAdmin = lazy(() => import('./containers/DefaultTextsAdmin'))
// istanbul ignore next
const StandardTextsAdmin = lazy(() => import('./containers/StandardTextsAdmin'))
// istanbul ignore next

const StandardTextsDetail = lazy(() =>
  import('./containers/StandardTextsAdmin/components/DetailPage')
)
// istanbul ignore next
const IncidentSplitContainer = lazy(() =>
  import('./containers/IncidentSplitContainer')
)
// istanbul ignore next
const ReporterContainer = lazy(() => import('./containers/ReporterContainer'))
const AreaContainer = lazy(() => import('./containers/AreaContainer'))
const SignalingContainer = lazy(() => import('./containers/SignalingContainer'))

const IncidentManagement = () => {
  const districts = useSelector(makeSelectDistricts)
  const searchQueryIncidents = useSelector(makeSelectSearchQuery)
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState()
  const [activeFilter, setActiveFilter] = useState()
  const [searchQuery, setSearchQuery] = useState('')

  const contextValue = useMemo(
    () => ({
      districts,
      standardTexts: {
        page,
        setPage,
        statusFilter,
        setStatusFilter,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
      },
    }),
    [activeFilter, districts, page, searchQuery, statusFilter]
  )

  useEffect(() => {
    // prevent continuing (and performing unnecessary API calls)
    // when the current session has not been authenticated
    if (!getIsAuthenticated()) return

    if (searchQueryIncidents) {
      dispatch(searchIncidents(searchQueryIncidents))
    } else {
      dispatch(requestIncidents())
    }

    if (configuration.featureFlags.fetchDistrictsFromBackend) {
      dispatch(getDistricts())
    }

    dispatch(getFilters())
  }, [dispatch, searchQueryIncidents])

  if (!getIsAuthenticated()) {
    return (
      <Routes>
        <Route path={'*'} element={<LoginPage />} />
      </Routes>
    )
  }

  return (
    <IncidentManagementContext.Provider value={contextValue}>
      <Suspense fallback={<LoadingIndicator />}>
        <Routes>
          <Route
            path={`${routes.incidents}/*`}
            element={<IncidentOverviewPage />}
          />
          <Route path={routes.incident} element={<IncidentDetail />} />
          <Route path={routes.split} element={<IncidentSplitContainer />} />
          {configuration.featureFlags.enableReporter && (
            <Route path={routes.reporter} element={<ReporterContainer />} />
          )}
          {configuration.featureFlags.enableNearIncidents && (
            <Route path={routes.area} element={<AreaContainer />} />
          )}

          {configuration.featureFlags.showStandardTextAdminV1 && (
            <Route path={routes.defaultTexts} element={<DefaultTextsAdmin />} />
          )}
          {configuration.featureFlags.showStandardTextAdminV2 && (
            <Route path={routes.standardTexts}>
              <Route index element={<StandardTextsAdmin />} />
              <Route path={`:id`} element={<StandardTextsDetail />} />
            </Route>
          )}
          <Route path={routes.signaling} element={<SignalingContainer />} />
          <Route path={'/*'} element={<IncidentOverviewPage />} />
        </Routes>
      </Suspense>
    </IncidentManagementContext.Provider>
  )
}

const withReducer = injectReducer({ key: 'incidentManagement', reducer })
const withSaga = injectSaga({ key: 'incidentManagement', saga })

export default compose(withReducer, withSaga)(IncidentManagement)
