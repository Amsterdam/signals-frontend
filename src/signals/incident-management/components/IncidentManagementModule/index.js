import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Route } from 'react-router-dom';

import LoginPage from 'components/LoginPage';
import {
  makeSelectLoading,
  makeSelectError,
  makeSelectIsAuthenticated,
  makeSelectCategories,
  makeSelectPriorityList,
  makeSelectStadsdeelList,
  makeSelectStatusList,
  makeSelectFeedbackList,
} from 'containers/App/selectors';

import IncidentOverviewPage from '../../containers/IncidentOverviewPage';
import IncidentDetail from '../../containers/IncidentDetail';
import DashboardContainer from '../../containers/DashboardContainer';
import DefaultTextsAdmin from '../../containers/DefaultTextsAdmin';
import IncidentSplitContainer from '../../containers/IncidentSplitContainer';

export const incidentDetailWrapper = (baseUrl, rest) => (props) => (
  // eslint-disable-next-line react/prop-types
  <IncidentDetail id={props.match.params.id} baseUrl={baseUrl} {...rest} />
);

export const incidentOverviewPageWrapper = (baseUrl, rest) => () => (
  // eslint-disable-next-line react/prop-types
  <IncidentOverviewPage baseUrl={baseUrl} {...rest} />
);

export const incidentSplitContainerWrapper = (baseUrl, rest) => (props) => (
  <IncidentSplitContainer
    // eslint-disable-next-line react/prop-types
    id={props.match.params.id}
    baseUrl={baseUrl}
    {...rest}
  />
);

export const defaultTextsAdminWrapper = (props) => () => (
  <DefaultTextsAdmin {...props} />
);

export const dashboardContainerWrapper = (props) => () => (
  <DashboardContainer {...props} />
);

export const IncidentManagementModuleComponent = ({
  isAuthenticated,
  match: { url },
  error,
  loading,
  dispatch,
  history,
  location,
  staticContext,
  ...dataLists
}) =>
  !isAuthenticated ? (
    <Route component={LoginPage} />
  ) : (
    <Fragment>
      <Route
        exact
        path={`${url}/incidents`}
        render={incidentOverviewPageWrapper(url, {
          ...dataLists,
          error,
          loading,
        })}
      />
      <Route
        exact
        path={`${url}/incident/:id`}
        render={incidentDetailWrapper(url, { ...dataLists, error, loading })}
      />
      <Route
        exact
        path={`${url}/incident/:id/split`}
        render={incidentSplitContainerWrapper(url, {
          ...dataLists,
          error,
          loading,
        })}
      />
      <Route
        path={`${url}/standaard/teksten`}
        render={defaultTextsAdminWrapper({
          ...dataLists,
          error,
          loading,
        })}
      />
      <Route
        path={`${url}/dashboard`}
        render={dashboardContainerWrapper({
          ...dataLists,
          error,
          loading,
        })}
      />
    </Fragment>
  );

IncidentManagementModuleComponent.propTypes = {
  error: PropTypes.bool,
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }),
};

const mapStateToProps = createStructuredSelector({
  categories: makeSelectCategories(),
  error: makeSelectError(),
  feedbackList: makeSelectFeedbackList(),
  isAuthenticated: makeSelectIsAuthenticated(),
  loading: makeSelectLoading(),
  priorityList: makeSelectPriorityList(),
  stadsdeelList: makeSelectStadsdeelList(),
  statusList: makeSelectStatusList(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(IncidentManagementModuleComponent);
