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

import './style.scss';

const AdminComponent = ({ match }) => {
  const baseUrl = match.url;
  const IncidentDetailPageWrapper = (props) => (<IncidentDetailPage id={props.match.params.id} baseUrl={baseUrl} />);
  const OverviewPageWrapper = () => (<OverviewPage baseUrl={baseUrl} />);

  return (
    <div className="admin-component">
      <div>
        <Route exact path={`${baseUrl}/incidents`} render={OverviewPageWrapper} />
        <Route exact path={`${baseUrl}/incident/:id`} render={IncidentDetailPageWrapper} />
      </div>
    </div>
  );
};

AdminComponent.propTypes = {
  match: PropTypes.object
};


export default AdminComponent;
