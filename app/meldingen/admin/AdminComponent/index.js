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
import { logout } from '../../../shared/services/auth/auth';


const AdminComponent = ({ match, isAuthenticated, userName }) => {
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
          <div>
            <div className="notification notification-grey margin-top-bottom">
              <div className="row">
                <div className="col-10">
                  Welkom, <b>{userName}</b>!
                </div>
                <div className="col-2">
                  <button className="action tertiair" onClick={logout}>
                    <span className="value">Uitloggen</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Route exact path={`${baseUrl}/incidents`} render={OverviewPageWrapper} />
                <Route exact path={`${baseUrl}/incident/:id`} render={IncidentDetailPageWrapper} />
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

AdminComponent.defaultProps = {
  isAuthenticated: false,
  userName: ''
};

AdminComponent.propTypes = {
  match: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  userName: PropTypes.string
};

export default AdminComponent;
