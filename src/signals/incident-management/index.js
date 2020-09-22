import React, { useEffect, lazy, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { compose } from 'redux';
import { Route, Switch } from 'react-router-dom';

import useFetch from 'hooks/useFetch';
import configuration from 'shared/services/configuration/configuration';
import { isAuthenticated } from 'shared/services/auth/auth';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import useLocationReferrer from 'hooks/useLocationReferrer';
import { makeSelectSearchQuery } from 'containers/App/selectors';
import LoadingIndicator from 'components/LoadingIndicator';

import { getDistricts, getFilters, searchIncidents, requestIncidents } from './actions';

import IncidentManagementContext from './context';
import reducer from './reducer';
import saga from './saga';
import routes from './routes';
import { makeSelectDistricts } from './selectors';

// Not possible to properly test the async loading, setting coverage reporter to ignore lazy imports
// istanbul ignore next
const LoginPage = lazy(() => import('components/LoginPage'));
// istanbul ignore next
const IncidentOverviewPage = lazy(() => import('./containers/IncidentOverviewPage'));
// istanbul ignore next
const IncidentDetail = lazy(() => import('./containers/IncidentDetail'));
// istanbul ignore next
const DefaultTextsAdmin = lazy(() => import('./containers/DefaultTextsAdmin'));
// istanbul ignore next
const LegacyIncidentSplitContainer = lazy(() => import('./containers/LegacyIncidentSplitContainer'));

const IncidentManagement = () => {
  const location = useLocationReferrer();
  const districts = useSelector(makeSelectDistricts);
  const searchQuery = useSelector(makeSelectSearchQuery);
  const dispatch = useDispatch();
  const users = useFetch();

  useEffect(() => {
    // prevent continuing (and performing unncessary API calls)
    // when the current session has not been authenticated
    if (!isAuthenticated()) return;

    if (searchQuery) {
      dispatch(searchIncidents(searchQuery));
    } else {
      dispatch(requestIncidents());
    }

    users.get(configuration.USERS_ENDPOINT);
    if (configuration.fetchDistrictsFromBackend) {
      dispatch(getDistricts());
    }

    dispatch(getFilters());
  }, [dispatch, searchQuery]);

  if (!isAuthenticated()) {
    return <Route component={LoginPage} />;
  }

  return (
    <IncidentManagementContext.Provider value={{ districts, loading: users.isLoading, users: users.data?.results }}>
      <Suspense fallback={<LoadingIndicator />}>
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

const withReducer = injectReducer({ key: 'incidentManagement', reducer });
const withSaga = injectSaga({ key: 'incidentManagement', saga });

export default compose(withReducer, withSaga)(IncidentManagement);
