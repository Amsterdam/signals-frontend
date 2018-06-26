/**
*
* AdminComponent
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import OverviewPage from '../containers/OverviewPage';
import IncidentDetailPage from '../containers/IncidentDetailPage';
import LoginPage from '../containers/LoginPage';

import './style.scss';

const AdminComponent = ({ match, isAuthenticated }) => {
  const baseUrl = match.url;
  const IncidentDetailPageWrapper = (props) => (<IncidentDetailPage id={props.match.params.id} baseUrl={baseUrl} />);
  const OverviewPageWrapper = () => (<OverviewPage baseUrl={baseUrl} />);
  const LoginPageWrapper = () => (<LoginPage baseUrl={baseUrl} />);

  return (
    <div className="admin-component">
      {
        !isAuthenticated ? (
          <Route render={LoginPageWrapper} />
        ) : (
          <div className="row">
            <div className="col-12">
              <Route exact path={`${baseUrl}/incidents`} render={OverviewPageWrapper} />
              <Route exact path={`${baseUrl}/incident/:id`} render={IncidentDetailPageWrapper} />
            </div>
          </div>
        )
      }
    </div>
  );
};

AdminComponent.defaultProps = {
  isAuthenticated: false
};

AdminComponent.propTypes = {
  match: PropTypes.object,
  isAuthenticated: PropTypes.bool
};

export default AdminComponent;
