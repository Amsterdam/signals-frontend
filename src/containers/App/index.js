import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Switch, Route, Redirect, withRouter, useHistory,
} from 'react-router-dom';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import defer from 'lodash.defer';

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
import KtoContainer from 'signals/incident/containers/KtoContainer';

import reducer from './reducer';
import saga from './saga';
import { requestCategories } from './actions';

export const AppContainer = ({ requestCategoriesAction }) => {
  // on each component render, see if the current session is authenticated
  authenticate();
  const history = useHistory();

  useEffect(() => {
    requestCategoriesAction();
  }, [requestCategoriesAction]);

  useEffect(() => {
    const unlisten = history.listen(() => {
      defer(() => {
        global.window.scrollTo({
          top: 0,
          left: 0,
        });
      });
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
            <Redirect exact from="/" to="/incident" />
            <Redirect exact from="/login" to="/manage" />
            <Route path="/instellingen" component={SettingsModule} />
            <Route path="/manage" component={IncidentManagementModule} />
            <Route path="/incident" component={IncidentContainer} />
            <Route path="/kto/:yesNo/:uuid" component={KtoContainer} />
            <Route path="" component={NotFoundPage} />
          </Switch>
        </div>

        {!isAuthenticated() && <Footer />}
      </Fragment>
    </ThemeProvider>
  );
};

AppContainer.propTypes = {
  requestCategoriesAction: PropTypes.func.isRequired,
};

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      requestCategoriesAction: requestCategories,
    },
    dispatch
  );

const withConnect = connect(null, mapDispatchToProps);

const withReducer = injectReducer({ key: 'global', reducer });
const withSaga = injectSaga({ key: 'global', saga });

export default compose(
  withReducer,
  withSaga,
  withRouter,
  withConnect
)(AppContainer);
