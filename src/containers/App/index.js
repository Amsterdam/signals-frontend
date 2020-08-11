import React, { Fragment, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { compose, bindActionCreators } from 'redux';
import { connect, useSelector } from 'react-redux';

import configuration from 'shared/services/configuration/configuration';
import { authenticate, isAuthenticated } from 'shared/services/auth/auth';
import ThemeProvider from 'components/ThemeProvider';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import NotFoundPage from 'components/NotFoundPage';
import Footer from 'components/Footer';
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
import reducer from './reducer';
import saga from './saga';
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

export const AppContainer = ({ resetIncidentAction, getSourcesAction }) => {
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
      resetIncidentAction();
    }
  }, [location, resetIncidentAction]);

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

    if (configuration.fetchSourcesFromBackend) {
      getSourcesAction();
    }
    // disabling linter; no deps needed, only execute on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <Route path="/kto/:yesNo/:uuid" component={KtoContainer} />
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

AppContainer.propTypes = {
  getSourcesAction: PropTypes.func.isRequired,
  resetIncidentAction: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      resetIncidentAction: resetIncident,
      getSourcesAction: getSources,
    },
    dispatch
  );

const withConnect = connect(null, mapDispatchToProps);
const withReducer = injectReducer({ key: 'global', reducer });
const withSaga = injectSaga({ key: 'global', saga });

export default compose(withReducer, withSaga, withConnect)(AppContainer);
