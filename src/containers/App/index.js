import React, { Fragment, useEffect, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import configuration from 'shared/services/configuration/configuration';
import { authenticate, isAuthenticated } from 'shared/services/auth/auth';

import { fetchCategories as fetchCategoriesAction } from 'models/categories/actions';
import Footer from 'components/Footer';
import LoadingIndicator from 'components/LoadingIndicator';
import ThemeProvider from 'components/ThemeProvider';
import SiteHeaderContainer from 'containers/SiteHeader';

import { resetIncident } from 'signals/incident/containers/IncidentContainer/actions';
import useLocationReferrer from 'hooks/useLocationReferrer';
import useIsFrontOffice from 'hooks/useIsFrontOffice';

import { getSources } from './actions';
import AppContext from './context';
import { makeSelectLoading, makeSelectSources } from './selectors';

const FooterContainer = styled.div`
  margin: 0 auto;
  background-color: #ffffff;
  width: 100%;
  max-width: 1400px;
`;

const ContentContainer = styled.div`
  background-color: #ffffff;
  flex: 1 0 auto;
  margin: 0 auto;
  max-width: 1400px;
  padding-bottom: 20px;
  width: 100%;
  z-index: 0;
  padding-top: ${({ headerIsTall }) => !headerIsTall && 50}px;
`;

// Not possible to properly test the async loading, setting coverage reporter to ignore lazy imports
// istanbul ignore next
const IncidentContainer = lazy(() => import('signals/incident/containers/IncidentContainer'));
// istanbul ignore next
const KtoContainer = lazy(() => import('signals/incident/containers/KtoContainer'));
// istanbul ignore next
const IncidentManagementModule = lazy(() => import('signals/incident-management'));
// istanbul ignore next
const SettingsModule = lazy(() => import('signals/settings'));
// istanbul ignore next
const NotFoundPage = lazy(() => import('components/NotFoundPage'));

export const AppContainer = () => {
  const dispatch = useDispatch();
  const loading = useSelector(makeSelectLoading());
  const sources = useSelector(makeSelectSources);
  const history = useHistory();
  const location = useLocationReferrer();
  const isFrontOffice = useIsFrontOffice();
  const headerIsTall = isFrontOffice && !isAuthenticated();

  authenticate();

  useEffect(() => {
    const { referrer } = location;

    if (referrer === '/incident/bedankt') {
      dispatch(resetIncident());
    }
  }, [dispatch, location]);

  useEffect(() => {
    const unlisten = history.listen(() => {
      global.window.scrollTo(0, 0);
    });

    return () => {
      unlisten();
    };
  }, [history]);

  useEffect(() => {
    // prevent continuing (and performing unncessary API calls)
    // when the current session has not been authenticated
    if (!isAuthenticated()) return;

    dispatch(fetchCategoriesAction());

    if (configuration.fetchSourcesFromBackend) {
      dispatch(getSources());
    }
  }, [dispatch]);

  return (
    <ThemeProvider>
      <AppContext.Provider value={{ loading, sources }}>
        <Fragment>
          <SiteHeaderContainer />

          <ContentContainer headerIsTall={headerIsTall}>
            <Suspense fallback={<LoadingIndicator />}>
              <Switch>
                <Redirect exact from="/" to="/incident/beschrijf" />
                <Redirect exact from="/login" to="/manage" />
                <Redirect exact from="/manage" to="/manage/incidents" />
                <Route path="/manage" component={IncidentManagementModule} />
                <Route path="/instellingen" component={SettingsModule} />
                <Route path="/incident" component={IncidentContainer} />
                <Route path="/kto/:satisfactionIndication/:uuid" component={KtoContainer} />
                <Route exact path="/categorie/:category/:subcategory" component={IncidentContainer} />
                <Route component={NotFoundPage} />
              </Switch>
            </Suspense>
          </ContentContainer>

          {!isAuthenticated() && (
            <FooterContainer>
              <Footer />
            </FooterContainer>
          )}
        </Fragment>
      </AppContext.Provider>
    </ThemeProvider>
  );
};

export default AppContainer;
