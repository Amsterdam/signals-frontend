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
import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import MainMenu from 'components/MainMenu';

import OverviewPage from '../../meldingen/admin/containers/OverviewPage/Loadable';
import IncidentContainer from '../../meldingen/incident/containers/IncidentContainer/Loadable';

export default function App() {
  return (
    <div>
      <div className="container app-container">
        <div className="container">
          <Header />
        </div>
        <div className="container-fluid">
          <MainMenu />
        </div>
        <div className="content container">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/features" component={FeaturePage} />
            <Route path="/admin" component={OverviewPage} />
            <Route path="/incident" component={IncidentContainer} />
            <Route path="" component={NotFoundPage} />
          </Switch>
        </div>
        <div className="container-fluid">
          <Footer />
        </div>
      </div>
    </div>
  );
}
