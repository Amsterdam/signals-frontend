import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isAuthenticated } from 'shared/services/auth/auth';
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

import reducer from './reducer';
import saga from './saga';

export const AppContainer = ({ resetIncidentAction }) => {
  const history = useHistory();
  const location = useLocationReferrer();

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

  return (
    <ThemeProvider>
      <Fragment>
        <SiteHeaderContainer />

        <div className="app-container">
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
        </div>

        {!isAuthenticated() && <Footer />}
      </Fragment>
    </ThemeProvider>
  );
};

AppContainer.propTypes = {
  resetIncidentAction: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      resetIncidentAction: resetIncident,
    },
    dispatch
  );

const withConnect = connect(null, mapDispatchToProps);
const withReducer = injectReducer({ key: 'global', reducer });
const withSaga = injectSaga({ key: 'global', saga });

export default compose(withReducer, withSaga, withConnect)(AppContainer);
