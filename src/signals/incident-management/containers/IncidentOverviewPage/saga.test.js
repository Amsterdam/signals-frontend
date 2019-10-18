import { put, takeLatest, select, call, take } from 'redux-saga/effects';
import { push } from 'connected-react-router/immutable';
import { authCall, authDeleteCall } from 'shared/services/api/api';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import CONFIGURATION from 'shared/services/configuration/configuration';

import {
  APPLY_FILTER,
  APPLY_FILTER_REFRESH,
  APPLY_FILTER_REFRESH_STOP,
  GET_FILTERS,
  INCIDENT_SELECTED,
  REMOVE_FILTER,
  REQUEST_INCIDENTS,
} from './constants';
import {
  applyFilterRefresh,
  applyFilterRefreshStop,
  filterIncidentsChanged,
  getFiltersFailed,
  getFiltersSuccess,
  pageIncidentsChanged,
  removeFilterFailed,
  removeFilterSuccess,
  requestIncidents,
  requestIncidentsError,
  requestIncidentsSuccess,
  sortIncidentsChanged,
} from './actions';
import watchRequestIncidentSaga, {
  applyFilter,
  fetchIncidents,
  getFilters,
  openIncident,
  refreshIncidents,
  removeFilter,
} from './saga';
import { makeSelectFilter } from './selectors';

describe('signals/incident-management/containers/IncidentOverviewPage/saga', () => {
  it('should watchRequestIncidentsSaga', () => {
    testSaga(watchRequestIncidentSaga)
      .next()
      .all([
        takeLatest(REQUEST_INCIDENTS, fetchIncidents),
        takeLatest(INCIDENT_SELECTED, openIncident),
        takeLatest(GET_FILTERS, getFilters),
        takeLatest(REMOVE_FILTER, removeFilter),
        takeLatest(APPLY_FILTER, applyFilter),
      ])
      .next()
      .take(APPLY_FILTER_REFRESH)
      .next()
      .race([call(refreshIncidents), take(APPLY_FILTER_REFRESH_STOP)])
      .finish()
      .next()
      .isDone();
  });

  it('should openIncident success', () => {
    const id = 1000;
    const incident = { id };
    const action = { payload: incident };
    const navigateUrl = `incident/${incident.id}`;

    const gen = openIncident(action);
    expect(gen.next().value).toEqual(put(push(navigateUrl))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should fetchIncidents success', () => {
    const filter = { name: 'filter', refresh: false };
    const page = 2;
    const sort = '-created_at';
    const action = { payload: { filter, page, sort } };
    const incidents = [{}, {}];
    const params = { test: 'test' };
    const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/signals/`;

    testSaga(fetchIncidents, action)
      .next()
      .put(applyFilterRefreshStop())
      .next()
      .put(filterIncidentsChanged(filter))
      .next()
      .put(pageIncidentsChanged(page))
      .next()
      .put(sortIncidentsChanged(sort))
      .next()
      .next(params)
      .call(authCall, requestURL, params)
      .next(incidents)
      .put(requestIncidentsSuccess(incidents))
      .next()
      .put(applyFilterRefresh())
      .next()
      .isDone();
  });

  it('should fetchIncidents success with sort days_open', () => {
    const filter = { name: 'filter' };
    const page = 2;
    const sort = 'days_open';
    const action = { payload: { filter, page, sort } };
    const params = { ordering: 'days_open' };
    const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/signals/`;

    testSaga(fetchIncidents, action)
      .next()
      .put(applyFilterRefreshStop())
      .next()
      .put(filterIncidentsChanged(filter))
      .next()
      .put(pageIncidentsChanged(page))
      .next()
      .put(sortIncidentsChanged(sort))
      .next()
      .next(params)
      .call(authCall, requestURL, {
        ordering: '-created_at',
      })
      .finish()
      .isDone();
  });

  it('should fetchIncidents success with sort -days_open', () => {
    const filter = { name: 'filter' };
    const page = 2;
    const sort = '-days_open';
    const action = { payload: { filter, page, sort } };
    const params = { ordering: '-days_open' };
    const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/signals/`;

    testSaga(fetchIncidents, action)
      .next()
      .put(applyFilterRefreshStop())
      .next()
      .put(filterIncidentsChanged(filter))
      .next()
      .put(pageIncidentsChanged(page))
      .next()
      .put(sortIncidentsChanged(sort))
      .next()
      .next(params)
      .call(authCall, requestURL, {
        ordering: 'created_at',
      })
      .finish()
      .isDone();
  });

  it('should fetchIncidents error', () => {
    const id = 1000;
    const action = { payload: id };
    const error = new Error('404 Not Found');

    const gen = fetchIncidents(action);
    gen.next();
    expect(gen.throw(error).value).toEqual(put(requestIncidentsError(error))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should getFilters success', () => {
    const filters = { results: [{ a: 1 }] };
    const requestURL =
      'https://acc.api.data.amsterdam.nl/signals/v1/private/me/filters/';

    testSaga(getFilters)
      .next()
      .call(authCall, requestURL)
      .next(filters)
      .put(getFiltersSuccess(filters.results))
      .next()
      .isDone();
  });

  it('should getFilters error', () => {
    const error = new Error('404 Not Found');

    const gen = getFilters();
    gen.next();
    expect(gen.throw(error).value).toEqual(put(getFiltersFailed(error))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should removeFilter success', () => {
    const id = 1000;
    const action = { payload: id };
    const requestURL = `https://acc.api.data.amsterdam.nl/signals/v1/private/me/filters/${id}`;

    testSaga(removeFilter, action)
      .next()
      .call(authDeleteCall, requestURL)
      .next(id)
      .put(removeFilterSuccess(id))
      .next()
      .isDone();
  });

  it('should removeFilter error', () => {
    const error = new Error('404 Not Found');

    const gen = removeFilter(666);
    gen.next();
    expect(gen.throw(error).value).toEqual(put(removeFilterFailed())); // eslint-disable-line redux-saga/yield-effects
  });

  describe('incident refresh', () => {
    it('should NOT refresh incidents periodically', () => {
      const filter = {
        name: 'Foo bar baz',
      };

      return expectSaga(refreshIncidents, 100)
        .provide([[select(makeSelectFilter), filter]])
        .select(makeSelectFilter)
        .not.put(requestIncidents({ filter }))
        .silentRun(150);
    });

    it('should refresh incidents periodically', () => {
      const filter = {
        name: 'Foo bar baz',
        refresh: true,
      };

      return expectSaga(refreshIncidents, 100)
        .provide([[select(makeSelectFilter), filter]])
        .select(makeSelectFilter)
        .delay(100)
        .put(requestIncidents({ filter, page: undefined, sort: undefined }))
        .delay(100)
        .put(requestIncidents({ filter, page: undefined, sort: undefined }))
        .silentRun();
    });
  });
});
