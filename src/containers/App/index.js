import React, { Fragment, useEffect } from 'react';
import styled from 'styled-components';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import configuration from 'shared/services/configuration/configuration';
import { authenticate, isAuthenticated } from 'shared/services/auth/auth';

import { fetchCategories as fetchCategoriesAction } from 'models/categories/actions';
import NotFoundPage from 'components/NotFoundPage';
import Footer from 'components/Footer';
import ThemeProvider from 'components/ThemeProvider';
import SiteHeaderContainer from 'containers/SiteHeader';

import IncidentManagementModule from 'signals/incident-management';
import SettingsModule from 'signals/settings';
import IncidentContainer from 'signals/incident/containers/IncidentContainer';
import { resetIncident } from 'signals/incident/containers/IncidentContainer/actions';
import KtoContainer from 'signals/incident/containers/KtoContainer';
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
