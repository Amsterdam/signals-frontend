import React, { useEffect, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Route, Switch } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import configuration from 'shared/services/configuration/configuration';
import { isAuthenticated } from 'shared/services/auth/auth';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import useLocationReferrer from 'hooks/useLocationReferrer';
import { makeSelectSearchQuery } from 'containers/App/selectors';

import { getDistricts, getFilters, searchIncidents, requestIncidents } from './actions';

import IncidentManagementContext from './context';
import reducer from './reducer';
import saga from './saga';
import routes from './routes';
import { makeSelectDistricts } from './selectors';

const LoginPage = lazy(() => import('components/LoginPage'));
const IncidentOverviewPage = lazy(() => import('./containers/IncidentOverviewPage'));
const IncidentDetail = lazy(() => import('./containers/IncidentDetail'));
const DefaultTextsAdmin = lazy(() => import('./containers/DefaultTextsAdmin'));
const LegacyIncidentSplitContainer = lazy(() => import('./containers/LegacyIncidentSplitContainer'));

export const IncidentManagementModuleComponent = ({
  getDistrictsAction,
  getFiltersAction,
  requestIncidentsAction,
  searchIncidentsAction,
  searchQuery,
}) => {
  const location = useLocationReferrer();
  const districts = useSelector(makeSelectDistricts);

  useEffect(() => {
    // prevent continuing (and performing unncessary API calls)
    // when the current session has not been authenticated
    if (!isAuthenticated()) return;

    if (searchQuery) {
      searchIncidentsAction(searchQuery);
    } else {
      requestIncidentsAction();
    }

    if (configuration.fetchDistrictsFromBackend) {
      getDistrictsAction();
    }

    getFiltersAction();
  }, [
    getDistrictsAction,
    getFiltersAction,
    requestIncidentsAction,
    searchIncidentsAction,
    searchQuery,
  ]);

  if (!isAuthenticated()) {
    return <Route component={LoginPage} />;
  }

  return (
    <IncidentManagementContext.Provider value={{ districts }}>
      <Suspense>
        <Switch location={location}>
          <Route exact path={routes.incidents} component={IncidentOverviewPage} />
          <Route exact path={routes.incident} component={IncidentDetail} />
          <Route exact path={routes.split} component={LegacyIncidentSplitContainer} />
          <Route path={routes.defaultTexts} component={DefaultTextsAdmin} />
          <Route component={IncidentOverviewPage} />
        </Switch>
      </Suspense>
    </IncidentManagementContext.Provider>
  );
};

IncidentManagementModuleComponent.propTypes = {
  getDistrictsAction: PropTypes.func.isRequired,
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
      getDistrictsAction: getDistricts,
      getFiltersAction: getFilters,
      requestIncidentsAction: requestIncidents,
      searchIncidentsAction: searchIncidents,
    },
    dispatch
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'incidentManagement', reducer });
const withSaga = injectSaga({ key: 'incidentManagement', saga });

export default compose(withConnect, withReducer, withSaga)(IncidentManagementModuleComponent);
