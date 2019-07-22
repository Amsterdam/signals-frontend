import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Route } from 'react-router-dom';

import LoginPage from 'components/LoginPage';
import { makeSelectIsAuthenticated } from 'containers/App/selectors';

import IncidentOverviewPage from '../../containers/IncidentOverviewPage';
import IncidentDetail from '../../containers/IncidentDetail';
import DashboardContainer from '../../containers/DashboardContainer';
import DefaultTextsAdmin from '../../containers/DefaultTextsAdmin';
import IncidentSplitContainer from '../../containers/IncidentSplitContainer';

import './style.scss';

const IncidentManagementModule = (props) => {
  const { isAuthenticated } = props;
  const baseUrl = props.match.url;

  const IncidentDetailWrapper = (wrapperProps) => (
    <IncidentDetail id={wrapperProps.match.params.id} baseUrl={baseUrl} />
  );
  const IncidentOverviewPageWrapper = () => (
    <IncidentOverviewPage baseUrl={baseUrl} />
  );
  const IncidentSplitContainerWrapper = (wrapperProps) => (
    <IncidentSplitContainer id={wrapperProps.match.params.id} baseUrl={baseUrl} />
  );

  return !isAuthenticated ? (
    <Route component={LoginPage} />
  ) : (
    <Fragment>
      <Route
        exact
        path={`${baseUrl}/incidents`}
        render={IncidentOverviewPageWrapper}
      />
      <Route
        exact
        path={`${baseUrl}/incident/:id`}
        render={IncidentDetailWrapper}
      />
      <Route
        exact
        path={`${baseUrl}/incident/:id/split`}
        render={IncidentSplitContainerWrapper}
      />
      <Route
        path={`${baseUrl}/standaard/teksten`}
        component={DefaultTextsAdmin}
      />
      <Route path={`${baseUrl}/dashboard`} component={DashboardContainer} />
    </Fragment>
  );
};

IncidentManagementModule.propTypes = {
  match: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isAuthenticated: makeSelectIsAuthenticated(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(IncidentManagementModule);
