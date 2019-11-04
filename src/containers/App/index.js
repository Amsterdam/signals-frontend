import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Switch, Route, Redirect, withRouter,
} from 'react-router-dom';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { authenticate } from 'shared/services/auth/auth';
import ThemeProvider from 'components/ThemeProvider';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import NotFoundPage from 'containers/NotFoundPage';
import Footer from 'components/Footer';
import SiteHeaderContainer from 'containers/SiteHeader';
import GlobalError from 'containers/GlobalError';

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

  useEffect(() => {
    requestCategoriesAction();
  }, []);

  return (
    <ThemeProvider>
      <Fragment>
        <SiteHeaderContainer />

        <div className="app-container">
          <GlobalError />
          <Switch>
            <Redirect exact from="/" to="/incident" />
            <Redirect exact from="/login" to="/manage" />
            <Route path="/manage/instellingen" component={SettingsModule} />
            <Route path="/manage" component={IncidentManagementModule} />
            <Route path="/incident" component={IncidentContainer} />
            <Route path="/kto/:yesNo/:uuid" component={KtoContainer} />
            <Route path="" component={NotFoundPage} />
          </Switch>
        </div>
        <Footer />
      </Fragment>
    </ThemeProvider>
  );
};

AppContainer.propTypes = {
  requestCategoriesAction: PropTypes.func.isRequired,
};

export const mapDispatchToProps = dispatch => bindActionCreators(
  {
    requestCategoriesAction: requestCategories,
  },
  dispatch,
);

const withConnect = connect(
  null,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'global', reducer });
const withSaga = injectSaga({ key: 'global', saga });

export default compose(
  withReducer,
  withSaga,
  withRouter,
  withConnect,
)(AppContainer);
