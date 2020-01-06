import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';

import { isAuthenticated } from 'shared/services/auth/auth';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import LoginPage from 'components/LoginPage';

import IncidentOverviewPage from './containers/IncidentOverviewPage';
import { requestIncidents } from './containers/IncidentOverviewPage/actions';
import IncidentDetail from './containers/IncidentDetail';
import DashboardContainer from './containers/DashboardContainer';
import DefaultTextsAdmin from './containers/DefaultTextsAdmin';
import IncidentSplitContainer from './containers/IncidentSplitContainer';

import { getFilters } from './actions';
import reducer from './reducer';
import saga from './saga';

export const incidentDetailWrapper = baseUrl => props => (
  // eslint-disable-next-line react/prop-types
  <IncidentDetail id={props.match.params.id} baseUrl={baseUrl} />
);

export const incidentOverviewPageWrapper = baseUrl => () => (
  // eslint-disable-next-line react/prop-types
  <IncidentOverviewPage baseUrl={baseUrl} />
);

export const incidentSplitContainerWrapper = baseUrl => props => (
  // eslint-disable-next-line react/prop-types
  <IncidentSplitContainer id={props.match.params.id} baseUrl={baseUrl} />
);

export const IncidentManagementModuleComponent = ({
  match: { url },
  getFiltersAction,
  requestIncidentsAction,
}) => {
  useEffect(() => {
    getFiltersAction();
    requestIncidentsAction();
  }, [getFiltersAction, requestIncidentsAction]);

  return !isAuthenticated() ? (
    <Route component={LoginPage} />
  ) : (
    <Fragment>
      <Route
        exact
        path={`${url}/incidents`}
        // render={incidentOverviewPageWrapper(url)}
        component={IncidentOverviewPage}
      />
      <Route
        exact
        path={`${url}/incident/:id`}
        // render={incidentDetailWrapper(url)}
        component={IncidentDetail}
      />
      <Route
        exact
        path={`${url}/incident/:id/split`}
        // render={incidentSplitContainerWrapper(url)}
        component={IncidentSplitContainer}
      />
      <Route path={`${url}/standaard/teksten`} component={DefaultTextsAdmin} />
      <Route path={`${url}/dashboard`} component={DashboardContainer} />
    </Fragment>
  );
};

IncidentManagementModuleComponent.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }),
  getFiltersAction: PropTypes.func.isRequired,
  requestIncidentsAction: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { getFiltersAction: getFilters, requestIncidentsAction: requestIncidents },
    dispatch
  );

const withConnect = connect(null, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentManagement', reducer });
const withSaga = injectSaga({ key: 'incidentManagement', saga });

export default compose(
  withConnect,
  withReducer,
  withSaga
)(IncidentManagementModuleComponent);
