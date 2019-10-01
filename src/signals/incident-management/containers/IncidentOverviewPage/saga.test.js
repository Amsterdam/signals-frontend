import { put, takeLatest, select, call, take } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { authCall } from 'shared/services/api/api';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';

import CONFIGURATION from 'shared/services/configuration/configuration';
import {
  makeSelectActiveFilter,
  makeSelectFilterParams,
} from 'signals/incident-management/selectors';

import {
  APPLY_FILTER_REFRESH,
  APPLY_FILTER_REFRESH_STOP,
  INCIDENT_SELECTED,
  REQUEST_INCIDENTS,
} from './constants';
import {
  applyFilterRefresh,
  applyFilterRefreshStop,
  pageIncidentsChanged,
  requestIncidents,
  requestIncidentsError,
  requestIncidentsSuccess,
  sortIncidentsChanged,
} from './actions';
import watchRequestIncidentSaga, {
  fetchIncidents,
  openIncident,
  refreshIncidents,
} from './saga';

describe('signals/incident-management/containers/IncidentOverviewPage/saga', () => {
  it('should watchRequestIncidentsSaga', () => {
    testSaga(watchRequestIncidentSaga)
      .next()
      .all([
        takeLatest(REQUEST_INCIDENTS, fetchIncidents),
        takeLatest(INCIDENT_SELECTED, openIncident),
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
    expect(gen.next().value).toEqual(put(push(navigateUrl)));
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

  it('should dispatch fetchIncidents error', () => {
    const id = 1000;
    const action = { payload: id };
    const message = '404 Not Found';
    const error = new Error(message);

    return expectSaga(fetchIncidents, action)
      .provide([
        [select(makeSelectFilterParams), {}],
        [matchers.call.fn(authCall), throwError(error)],
      ])
      .select(makeSelectFilterParams)
      .call.like(authCall)
      .put(requestIncidentsError(message))
      .run();
  });

  describe('incident refresh', () => {
    it('should NOT refresh incidents periodically', () => {
      const filter = {
        name: 'Foo bar baz',
      };

      return expectSaga(refreshIncidents, 100)
        .provide([[select(makeSelectActiveFilter), filter]])
        .select(makeSelectActiveFilter)
        .not.put(requestIncidents({ filter }))
        .silentRun(150);
    });

    it('should refresh incidents periodically', () => {
      const filter = {
        name: 'Foo bar baz',
        refresh: true,
      };

      return expectSaga(refreshIncidents, 100)
        .provide([[select(makeSelectActiveFilter), filter]])
        .select(makeSelectActiveFilter)
        .delay(100)
        .put(requestIncidents({ filter, page: undefined, sort: undefined }))
        .delay(100)
        .put(requestIncidents({ filter, page: undefined, sort: undefined }))
        .silentRun(250);
    });
  });
});
