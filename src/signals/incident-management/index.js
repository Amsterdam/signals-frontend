// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import { useEffect, lazy, Suspense, useMemo } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { compose } from 'redux'

import LoadingIndicator from 'components/LoadingIndicator'
import { makeSelectSearchQuery } from 'containers/App/selectors'
import useLocationReferrer from 'hooks/useLocationReferrer'
import { getIsAuthenticated } from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'

import {
  getDistricts,
  getFilters,
  searchIncidents,
  requestIncidents,
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
const IncidentSplitContainer = lazy(() =>
  import('./containers/IncidentSplitContainer')
)
// istanbul ignore next
const ReporterContainer = lazy(() => import('./containers/ReporterContainer'))
const AreaContainer = lazy(() => import('./containers/AreaContainer'))
const SignalingContainer = lazy(() => import('./containers/Signaling'))
const DashboardContainer = lazy(() => import('./containers/Dashboard'))

const IncidentManagement = () => {
  const location = useLocationReferrer()
  const districts = useSelector(makeSelectDistricts)
  const searchQuery = useSelector(makeSelectSearchQuery)
  const dispatch = useDispatch()
  const contextValue = useMemo(() => ({ districts }), [districts])

  useEffect(() => {
    // prevent continuing (and performing unncessary API calls)
    // when the current session has not been authenticated
    if (!getIsAuthenticated()) return

    if (searchQuery) {
      dispatch(searchIncidents(searchQuery))
    } else {
      dispatch(requestIncidents())
    }

    if (configuration.featureFlags.fetchDistrictsFromBackend) {
      dispatch(getDistricts())
    }

    dispatch(getFilters())
  }, [dispatch, searchQuery])

  if (!getIsAuthenticated()) {
    return <Route component={LoginPage} />
  }

  return (
    <IncidentManagementContext.Provider value={contextValue}>
      <Suspense fallback={<LoadingIndicator />}>
        <Switch location={location}>
          <Route
            exact
            path={routes.incidents}
            component={IncidentOverviewPage}
          />
          <Route exact path={routes.incident} component={IncidentDetail} />
          <Route exact path={routes.split} component={IncidentSplitContainer} />
          {configuration.featureFlags.enableReporter && (
            <Route exact path={routes.reporter} component={ReporterContainer} />
          )}
          {configuration.featureFlags.enableNearIncidents && (
            <Route exact path={routes.area} component={AreaContainer} />
          )}
          <Route path={routes.defaultTexts} component={DefaultTextsAdmin} />
          <Route exact path={routes.signaling} component={SignalingContainer} />
          <Route exact path={routes.dashboard} component={DashboardContainer} />
          <Route component={IncidentOverviewPage} />
        </Switch>
      </Suspense>
    </IncidentManagementContext.Provider>
  )
}

const withReducer = injectReducer({ key: 'incidentManagement', reducer })
const withSaga = injectSaga({ key: 'incidentManagement', saga })

export default compose(withReducer, withSaga)(IncidentManagement)
