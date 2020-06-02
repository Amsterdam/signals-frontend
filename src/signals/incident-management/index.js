import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Route, Switch } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { isAuthenticated } from 'shared/services/auth/auth';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { fetchCategories } from 'models/categories/actions';
import useLocationReferrer from 'hooks/useLocationReferrer';
import { makeSelectSearchQuery } from 'containers/App/selectors';

import LoginPage from 'components/LoginPage';

import IncidentOverviewPage from './containers/IncidentOverviewPage';
import { getFilters, searchIncidents, requestIncidents } from './actions';
import IncidentDetail from './containers/IncidentDetail';
import DefaultTextsAdmin from './containers/DefaultTextsAdmin';
import IncidentSplitContainer from './containers/IncidentSplitContainer';

import reducer from './reducer';
import saga from './saga';
import routes from './routes';

export const IncidentManagementModuleComponent = ({
  fetchCategoriesAction,
  getFiltersAction,
  requestIncidentsAction,
  searchIncidentsAction,
  searchQuery,
}) => {
  const location = useLocationReferrer();

  useEffect(() => {
    // prevent continuing (and performing unncessary API calls)
    // when the current session has not been authenticated
    if (!isAuthenticated()) return;

    if (searchQuery) {
      searchIncidentsAction(searchQuery);
    } else {
      requestIncidentsAction();
    }

    getFiltersAction();
    fetchCategoriesAction();
    // disabling linter; no deps needed, only execute on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAuthenticated()) {
    return <Route component={LoginPage} />;
  }

  return (
    <Switch location={location}>
      <Route exact path={routes.incidents} component={IncidentOverviewPage} />
      <Route exact path={routes.incident} component={IncidentDetail} />
      <Route exact path={routes.split} component={IncidentSplitContainer} />
      <Route path={routes.defaultTexts} component={DefaultTextsAdmin} />
      <Route component={IncidentOverviewPage} />
    </Switch>
  );
};

IncidentManagementModuleComponent.propTypes = {
  fetchCategoriesAction: PropTypes.func.isRequired,
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
      fetchCategoriesAction: fetchCategories,
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
