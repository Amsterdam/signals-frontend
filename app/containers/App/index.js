/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Admin from 'containers/Admin/Loadable';
import Footer from 'components/Footer';
import MainMenu from 'components/MainMenu';
import HeaderContainer from 'containers/HeaderContainer';

import IncidentContainer from '../../meldingen/incident/containers/IncidentContainer/Loadable';

export default function App() {
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
          <Route path="/admin" component={Admin} />
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
