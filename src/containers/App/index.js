import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';

import NotFoundPage from 'containers/NotFoundPage';
import Footer from 'components/Footer';
import MainMenu from 'components/MainMenu';
import HeaderContainer from 'containers/HeaderContainer';

import saga from './saga';
import IncidentManagementContainer from '../../signals/incident-management';
import IncidentContainer from '../../signals/incident/containers/IncidentContainer';

export class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="container app-container">
        <div className="container">
          <HeaderContainer />
        </div>
        <div className="container-fluid">
          <MainMenu />
        </div>
        <div className="content container">
          <Switch>
            <Redirect exact from="/" to="/incident" />
            <Route path="/manage" component={IncidentManagementContainer} />
            <Route path="/incident" component={IncidentContainer} />
            <Route path="" component={NotFoundPage} />
          </Switch>
        </div>
        <div className="container-fluid">
          <Footer />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  isAuthenticated: PropTypes.bool
};

const withSaga = injectSaga({ key: 'app', saga });

export default compose(
  withSaga
)(App);
