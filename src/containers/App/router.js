import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';
import NotFoundPage from 'containers/NotFoundPage';
import IncidentManagementModule from '../../signals/incident-management';
import IncidentContainer from '../../signals/incident/containers/IncidentContainer';
import KtoContainer from '../../signals/incident/containers/KtoContainer';

const Router = () => (
  <Switch>
    <Redirect exact from="/" to="/incident" />
    <Redirect exact from="/login" to="/manage" />
    <Route path="/manage" component={IncidentManagementModule} />
    <Route path="/incident" component={IncidentContainer} />
    <Route
      path="/kto/:yesNo/:uuid"
      component={
        (props) => (<KtoContainer yesNo={props.match.params.yesNo} uuid={props.match.params.uuid} />)
      }
    />
    <Route path="" component={NotFoundPage} />
  </Switch>
);

Router.propTypes = {
  match: PropTypes.object
};

export default Router;
