/**
*
* AdminComponent
*
*/

import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import OverviewPage from '../containers/OverviewPage';
import IncidentDetailPage from '../containers/IncidentDetailPage';
import NotFoundPage from '../../../containers/NotFoundPage';

import './style.scss';

function AdminComponent() {
  return (
    <div className="admin-component">
      <FormattedMessage {...messages.header} />
      <BrowserRouter basename="/admin">
        <div>
          <Route path="/incidents" component={OverviewPage} />
          <Route path="/incident/:id" component={IncidentDetailPage} />
          <Route
            path="/"
            render={() => {
              console.log('dd');
              return (<Redirect to="/incidents" />);
            }}
          />
          <Route path="" component={IncidentDetailPage} />
        </div>
      </BrowserRouter>
    </div>
  );
}

AdminComponent.propTypes = {

};

export default AdminComponent;
