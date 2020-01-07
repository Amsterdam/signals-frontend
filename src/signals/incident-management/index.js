import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Route, Switch } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { isAuthenticated } from 'shared/services/auth/auth';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import LoginPage from 'components/LoginPage';

import IncidentOverviewPage from './containers/IncidentOverviewPage';
import { makeSelectSearchQuery } from './selectors';
import {
  getFilters,
  searchIncidents,
  requestIncidents,
} from './actions';
import IncidentDetail from './containers/IncidentDetail';
import DefaultTextsAdmin from './containers/DefaultTextsAdmin';
import IncidentSplitContainer from './containers/IncidentSplitContainer';

import reducer from './reducer';
import saga from './saga';

export const IncidentManagementModuleComponent = ({
  match: { url },
  getFiltersAction,
  requestIncidentsAction,
  searchIncidentsAction,
  searchQuery,
}) => {
  useEffect(() => {
    if (!isAuthenticated()) return;

    if (searchQuery) {
      searchIncidentsAction(searchQuery);
    } else {
      requestIncidentsAction();
    }

    getFiltersAction();
  }, [getFiltersAction, requestIncidentsAction]);

  if (!isAuthenticated()) {
    return <Route component={LoginPage} />;
  }

  return (
    <Switch>
      <Route exact path={`${url}/incidents`} component={IncidentOverviewPage} />
      <Route exact path={`${url}/incident/:id`} component={IncidentDetail} />
      <Route
        exact
        path={`${url}/incident/:id/split`}
        component={IncidentSplitContainer}
      />
      <Route path={`${url}/standaard/teksten`} component={DefaultTextsAdmin} />
    </Switch>
  );
};

IncidentManagementModuleComponent.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }),
  getFiltersAction: PropTypes.func.isRequired,
  requestIncidentsAction: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  searchIncidentsAction: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  searchQuery: makeSelectSearchQuery,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getFiltersAction: getFilters,
      requestIncidentsAction: requestIncidents,
      searchIncidentsAction: searchIncidents,
    },
    dispatch
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'incidentManagement', reducer });
const withSaga = injectSaga({ key: 'incidentManagement', saga });

export default compose(
  withConnect,
  withReducer,
  withSaga
)(IncidentManagementModuleComponent);
