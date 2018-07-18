/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage';
import NotFoundPage from 'containers/NotFoundPage';
import Footer from 'components/Footer';
import MainMenu from 'components/MainMenu';
import HeaderContainer from 'containers/HeaderContainer';

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
            <Route exact path="/" component={HomePage} />
            <Route path="/manage" component={IncidentManagementContainer} />
            {/* <Redirect to="/manage/incidents" from="/admin/incidents" /> */}
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

export default App;

