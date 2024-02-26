// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import { Fragment, useEffect, lazy, Suspense, useMemo, useRef } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import Footer from 'components/FooterContainer'
import LoadingIndicator from 'components/LoadingIndicator'
import { Toegankelijkheidsverklaring } from 'components/pages/ArticlePage'
import MaintenancePage from 'components/pages/MaintenancePage'
import ThemeProvider from 'components/ThemeProvider'
import SiteHeaderContainer from 'containers/SiteHeader'
import { useApiHealthCheck } from 'hooks/useApiHealthCheck'
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
import NotFoundPage from '../../components/pages/NotFoundPage'
import VerificationPage from '../../components/pages/VerificationPage'
import useDefaultHeader from '../../hooks/useDefaultHeader'
import useTallHeader from '../../hooks/useTallHeader'
import { ConfirmationProvider } from '../Confirmation'

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
  () => import('signals/incident/containers/KtoContainer/KtoContainer')
)
// istanbul ignore next
const IncidentManagementModule = lazy(
  () => import('signals/incident-management')
)
// istanbul ignore next
const SettingsModule = lazy(() => import('signals/settings'))
// istanbul ignore next
const IncidentMapContainer = lazy(() => import('signals/IncidentMap'))

// istanbul ignore next
const MyIncidents = lazy(() => import('signals/my-incidents'))

export const AppContainer = () => {
  const dispatch = useDispatch()
  const loading = useSelector(makeSelectLoading())
  const sources = useSelector(makeSelectSources)

  const location = useLocationReferrer()
  const locationFromUseLocation = useLocation()
  const isFrontOffice = useIsFrontOffice()
  const tallHeaderByDefault = useTallHeader()
  const headerIsTall =
    (isFrontOffice && !getIsAuthenticated()) || tallHeaderByDefault

  const contextValue = useMemo(() => ({ loading, sources }), [loading, sources])

  useApiHealthCheck()

  useEffect(() => {
    const { referrer } = location

    if (referrer === '/incident/bedankt') {
      dispatch(resetIncident())
    }
  }, [dispatch, location])

  const isFirstRenderRef = useRef(true)
  useEffect(() => {
    if (!isFirstRenderRef.current) {
      window.scrollTo(0, 0)
    }
    isFirstRenderRef.current = false
  }, [locationFromUseLocation])

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
        <ConfirmationProvider>
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
                <Routes>
                  <Route
                    path="/"
                    element={<Navigate to="incident/beschrijf" replace />}
                  />
                  <Route
                    path="login"
                    element={<Navigate to="/manage" replace />}
                  />
                  <Route
                    path="manage"
                    element={<Navigate to="/manage/incidents" replace />}
                  />
                  <Route
                    path="/manage/*"
                    element={<IncidentManagementModule />}
                  />
                  <Route path="/instellingen/*" element={<SettingsModule />} />
                  {configuration.featureFlags.enablePublicIncidentsMap && (
                    <Route
                      path="/meldingenkaart"
                      element={<IncidentMapContainer />}
                    />
                  )}
                  {configuration.featureFlags.enableMyIncidents && (
                    <Route path="/mijn-meldingen/*" element={<MyIncidents />} />
                  )}
                  <Route
                    path="/incident/reactie/:uuid"
                    element={<IncidentReplyContainer />}
                  />
                  {configuration.featureFlags
                    .enableForwardIncidentToExternal && (
                    <Route
                      path="/incident/extern/:id"
                      element={<ExternalReplyContainer />}
                    />
                  )}
                  <Route path="/incident/*" element={<IncidentContainer />} />
                  {configuration.featureFlags.enablePublicSignalMap && (
                    <Route
                      path="/kaart"
                      element={<IncidentOverviewContainer />}
                    />
                  )}
                  <Route
                    path="/kto/:satisfactionIndication/:uuid"
                    element={<KtoContainer />}
                  />
                  <Route
                    path="/categorie/:category/:subcategory"
                    element={<IncidentContainer />}
                  />
                  <Route
                    path="/toegankelijkheidsverklaring"
                    element={<Toegankelijkheidsverklaring />}
                  />
                  <Route
                    path="/verify_email/:token"
                    element={<VerificationPage />}
                  />
                  <Route path={'/onderhoud'} element={<MaintenancePage />} />
                  <Route path={'*'} element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </ContentContainer>
            <Footer />
          </Fragment>
        </ConfirmationProvider>
      </AppContext.Provider>
    </ThemeProvider>
  )
}

export default AppContainer
