// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { Fragment, useEffect, lazy, Suspense, useMemo } from 'react'
import styled from 'styled-components'
import { Switch, Route, Redirect, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getIsAuthenticated } from 'shared/services/auth/auth'

import { fetchCategories as fetchCategoriesAction } from 'models/categories/actions'
import { fetchDepartments as fetchDepartmentsAction } from 'models/departments/actions'
import Footer from 'components/Footer'
import LoadingIndicator from 'components/LoadingIndicator'
import ThemeProvider from 'components/ThemeProvider'
import SiteHeaderContainer from 'containers/SiteHeader'
import configuration from 'shared/services/configuration/configuration'
import IncidentContainer from 'signals/incident/containers/IncidentContainer'
import IncidentReplyContainer from 'signals/incident/containers/IncidentReplyContainer'
import IncidentOverviewContainer from 'signals/incident/containers/IncidentOverviewContainer'

import { resetIncident } from 'signals/incident/containers/IncidentContainer/actions'
import useLocationReferrer from 'hooks/useLocationReferrer'
import useIsFrontOffice from 'hooks/useIsFrontOffice'

import { getSources } from './actions'
import AppContext from './context'
import { makeSelectLoading, makeSelectSources } from './selectors'

const FooterContainer = styled.div`
  margin: 0 auto;
  background-color: #ffffff;
  width: 100%;
  max-width: 1400px;
`

const ContentContainer = styled.div<{ headerIsTall: boolean }>`
  background-color: #ffffff;
  flex: 1 0 auto;
  margin: 0 auto;
  max-width: 1400px;
  padding-bottom: 20px;
  width: 100%;
  z-index: 0;
  padding-top: ${({ headerIsTall }) => !headerIsTall && 50}px;
`

// Not possible to properly test the async loading, setting coverage reporter to ignore lazy imports
// istanbul ignore next
const KtoContainer = lazy(
  async () => import('signals/incident/containers/KtoContainer')
)
// istanbul ignore next
const IncidentManagementModule = lazy(
  async () => import('signals/incident-management')
)
// istanbul ignore next
const SettingsModule = lazy(async () => import('signals/settings'))
// istanbul ignore next
const NotFoundPage = lazy(async () => import('components/NotFoundPage'))

export const AppContainer = () => {
  const dispatch = useDispatch()
  const loading = useSelector(makeSelectLoading())
  const sources = useSelector(makeSelectSources)
  const history = useHistory()
  const location = useLocationReferrer() as { referrer: string }
  const isFrontOffice = useIsFrontOffice()
  const headerIsTall = isFrontOffice && !getIsAuthenticated()
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

  return (
    <ThemeProvider>
      <AppContext.Provider value={contextValue}>
        <Fragment>
          {!configuration.featureFlags.appMode && <SiteHeaderContainer />}

          <ContentContainer headerIsTall={headerIsTall}>
            <Suspense fallback={<LoadingIndicator />}>
              <Switch>
                <Redirect exact from="/" to="/incident/beschrijf" />
                <Redirect exact from="/login" to="/manage" />
                <Redirect exact from="/manage" to="/manage/incidents" />
                <Route path="/manage" component={IncidentManagementModule} />
                <Route path="/instellingen" component={SettingsModule} />
                <Route
                  path="/incident/reactie/:uuid"
                  component={IncidentReplyContainer}
                />
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
                <Route component={NotFoundPage} />
              </Switch>
            </Suspense>
          </ContentContainer>

          {!getIsAuthenticated() && (
            <FooterContainer>
              <Footer />
            </FooterContainer>
          )}
        </Fragment>
      </AppContext.Provider>
    </ThemeProvider>
  )
}

export default AppContainer
