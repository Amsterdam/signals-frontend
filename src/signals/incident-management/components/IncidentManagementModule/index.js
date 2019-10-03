import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { isAuthenticated } from 'shared/services/auth/auth';

import LoginPage from 'components/LoginPage';

import IncidentOverviewPage from '../../containers/IncidentOverviewPage';
import IncidentDetail from '../../containers/IncidentDetail';
import DashboardContainer from '../../containers/DashboardContainer';
import DefaultTextsAdmin from '../../containers/DefaultTextsAdmin';
import IncidentSplitContainer from '../../containers/IncidentSplitContainer';

export const incidentDetailWrapper = (baseUrl) => (props) => (
  // eslint-disable-next-line react/prop-types
  <IncidentDetail id={props.match.params.id} baseUrl={baseUrl} />
);

export const incidentOverviewPageWrapper = (baseUrl) => () => (
  // eslint-disable-next-line react/prop-types
  <IncidentOverviewPage baseUrl={baseUrl} />
);

export const incidentSplitContainerWrapper = (baseUrl) => (props) => (
  // eslint-disable-next-line react/prop-types
  <IncidentSplitContainer id={props.match.params.id} baseUrl={baseUrl} />
);

export const IncidentManagementModuleComponent = ({
  match: { url },
}) =>
  !isAuthenticated() ? (
    <Route component={LoginPage} />
  ) : (
    <Fragment>
      <Route
        exact
        path={`${url}/incidents`}
        render={incidentOverviewPageWrapper(url)}
      />
      <Route
        exact
        path={`${url}/incident/:id`}
        render={incidentDetailWrapper(url)}
      />
      <Route
        exact
        path={`${url}/incident/:id/split`}
        render={incidentSplitContainerWrapper(url)}
      />
      <Route path={`${url}/standaard/teksten`} component={DefaultTextsAdmin} />
      <Route path={`${url}/dashboard`} component={DashboardContainer} />
    </Fragment>
  );

IncidentManagementModuleComponent.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }),
};

export default IncidentManagementModuleComponent;
