// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import { Fragment, useEffect, lazy, Suspense, useMemo } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, Redirect, useHistory } from 'react-router-dom'
import styled from 'styled-components'

import Footer from 'components/FooterContainer'
import LoadingIndicator from 'components/LoadingIndicator'
import { Toegankelijkheidsverklaring } from 'components/pages/ArticlePage'
import ThemeProvider from 'components/ThemeProvider'
import SiteHeaderContainer from 'containers/SiteHeader'
import useIsFrontOffice from 'hooks/useIsFrontOffice'
import useLocationReferrer from 'hooks/useLocationReferrer'
import { fetchCategories as fetchCategoriesAction } from 'models/categories/actions'
import { fetchDepartments as fetchDepartmentsAction } from 'models/departments/actions'
import { getIsAuthenticated } from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'
import ExternalReplyContainer from 'signals/incident/containers/ExternalReplyContainer'
import IncidentContainer from 'signals/incident/containers/IncidentContainer'
import { resetIncident } from 'signals/incident/containers/IncidentContainer/actions'
import IncidentOverviewContainer from 'signals/incident/containers/IncidentOverviewContainer'
import IncidentReplyContainer from 'signals/incident/containers/IncidentReplyContainer'

import { getSources } from './actions'
import AppContext from './context'
import { makeSelectLoading, makeSelectSources } from './selectors'
import useDefaultHeader from '../../hooks/useDefaultHeader'
import useTallHeader from '../../hooks/useTallHeader'

const ContentContainer = styled.div<{
  padding: { top: number; bottom: number }
}>`
  position: relative;
  background-color: #ffffff;
  flex: 1 0 auto;
  margin: 0 auto;
  max-width: 1400px;
  padding-bottom: ${({ padding }) => padding.bottom}px;
  width: 100%;
  z-index: 0;
  padding-top: ${({ padding }) => padding.top}px;
`

// Not possible to properly test the async loading, setting coverage reporter to ignore lazy imports
// istanbul ignore next
const KtoContainer = lazy(
  () => import('signals/incident/containers/KtoContainer')
)
// istanbul ignore next
const IncidentManagementModule = lazy(
  () => import('signals/incident-management')
)
// istanbul ignore next
const SettingsModule = lazy(() => import('signals/settings'))
// istanbul ignore next
const NotFoundPage = lazy(() => import('components/pages/NotFoundPage'))
// istanbul ignore next
const IncidentMapContainer = lazy(() => import('signals/IncidentMap'))

// istanbul ignore next
const MyIncidents = lazy(() => import('signals/my-incidents'))

export const AppContainer = () => {
  const dispatch = useDispatch()
  const loading = useSelector(makeSelectLoading())
  const sources = useSelector(makeSelectSources)
  const history = useHistory()
  const location = useLocationReferrer() as { referrer: string }
  const isFrontOffice = useIsFrontOffice()
  const tallHeaderByDefault = useTallHeader()
  const headerIsTall =
    (isFrontOffice && !getIsAuthenticated()) || tallHeaderByDefault

  const contextValue = useMemo(() => ({ loading, sources }), [loading, sources])

  useEffect(() => {
    const { referrer } = location

    if (referrer === '/incident/bedankt') {
      dispatch(resetIncident())
    }
  }, [dispatch, location])

  useEffect(() => {
    const unlisten = history.listen(() => {
      global.window.scrollTo(0, 0)
    })

    return () => {
      unlisten()
    }
  }, [history])

  useEffect(() => {
    // prevent continuing (and performing unncessary API calls)
    // when the current session has not been authenticated
    if (!getIsAuthenticated()) return

    dispatch(fetchCategoriesAction())
    dispatch(fetchDepartmentsAction())
    dispatch(getSources())
  }, [dispatch])

  const defaultHeader = useDefaultHeader()

  return (
    <ThemeProvider>
      <AppContext.Provider value={contextValue}>
        <Fragment>
          {!configuration.featureFlags.appMode && defaultHeader && (
            <SiteHeaderContainer />
          )}

          <ContentContainer
            padding={{
              top: headerIsTall ? 0 : 50,
              bottom: getIsAuthenticated() ? 20 : 0,
            }}
          >
            <Suspense fallback={<LoadingIndicator />}>
              <Switch>
                <Redirect exact from="/" to="/incident/beschrijf" />
                <Redirect exact from="/login" to="/manage" />
                <Redirect exact from="/manage" to="/manage/incidents" />
                <Route path="/manage" component={IncidentManagementModule} />
                <Route path="/instellingen" component={SettingsModule} />
                {configuration.featureFlags.enablePublicIncidentsMap && (
                  <Route
                    path="/meldingenkaart"
                    component={IncidentMapContainer}
                  />
                )}
                {configuration.featureFlags.enableMyIncidents && (
                  <Route path="/mijn-meldingen" component={MyIncidents} />
                )}
                <Route
                  path="/incident/reactie/:uuid"
                  component={IncidentReplyContainer}
                />
                {configuration.featureFlags.enableForwardIncidentToExternal && (
                  <Route
                    path="/incident/extern/:id"
                    component={ExternalReplyContainer}
                  />
                )}
                <Route path="/incident" component={IncidentContainer} />
                {configuration.featureFlags.enablePublicSignalMap && (
                  <Route path="/kaart" component={IncidentOverviewContainer} />
                )}
                <Route
                  path="/kto/:satisfactionIndication/:uuid"
                  component={KtoContainer}
                />
                <Route
                  exact
                  path="/categorie/:category/:subcategory"
                  component={IncidentContainer}
                />
                <Route exact path="/toegankelijkheidsverklaring">
                  <Toegankelijkheidsverklaring />
                </Route>
                <Route component={NotFoundPage} />
              </Switch>
            </Suspense>
          </ContentContainer>
          <Footer />
        </Fragment>
      </AppContext.Provider>
    </ThemeProvider>
  )
}

export default AppContainer
