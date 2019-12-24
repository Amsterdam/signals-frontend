import { takeLatest, select, call, take } from 'redux-saga/effects';
import { authCall } from 'shared/services/api/api';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';

import CONFIGURATION from 'shared/services/configuration/configuration';
import incidentsJSON from 'utils/__tests__/fixtures/incidents.json';
import {
  makeSelectActiveFilter,
  makeSelectFilterParams,
} from 'signals/incident-management/selectors';

import {
  ORDERING_INCIDENTS_CHANGED,
  PAGE_INCIDENTS_CHANGED,
} from 'signals/incident-management/constants';

import {
  APPLY_FILTER_REFRESH_STOP,
  APPLY_FILTER_REFRESH,
  REQUEST_INCIDENTS,
  SEARCH_INCIDENTS,
} from './constants';
import {
  applyFilterRefresh,
  applyFilterRefreshStop,
  requestIncidents,
  requestIncidentsError,
  requestIncidentsSuccess,
} from './actions';
import watchRequestIncidentSaga, {
  fetchIncidents,
  refreshIncidents,
  searchIncidents,
} from './saga';

describe('signals/incident-management/containers/IncidentOverviewPage/saga', () => {
  it('should watchRequestIncidentsSaga', () => {
    testSaga(watchRequestIncidentSaga)
      .next()
      .all([
        takeLatest(SEARCH_INCIDENTS, searchIncidents),
        takeLatest(REQUEST_INCIDENTS, fetchIncidents),
        takeLatest(PAGE_INCIDENTS_CHANGED, fetchIncidents),
        takeLatest(ORDERING_INCIDENTS_CHANGED, fetchIncidents),
      ])
      .next()
      .take(APPLY_FILTER_REFRESH)
      .next()
      .race([call(refreshIncidents), take(APPLY_FILTER_REFRESH_STOP)])
      .finish()
      .next()
      .isDone();
  });

  describe('fetch incidents', () => {
    it('should fetchIncidents success', () => {
      const filter = { name: 'filter', refresh: false };
      const page = 2;
      const ordering = '-created_at';
      const incidents = [{}, {}];
      const params = { test: 'test' };
      const filterParams = {
        page,
        ordering,
        ...params,
      };

      return expectSaga(fetchIncidents)
        .provide([
          [select(makeSelectActiveFilter), filter],
          [select(makeSelectFilterParams), filterParams],
          [matchers.call.fn(authCall), incidents],
        ])
        .select(makeSelectActiveFilter)
        .put(requestIncidentsSuccess(incidents))
        .run();
    });

    it('should stop and start filter refresh', () => {
      const filter = { name: 'filter', refresh: true };

      return expectSaga(fetchIncidents)
        .provide([
          [select(makeSelectActiveFilter), filter],
          [matchers.call.fn(authCall), []],
        ])
        .select(makeSelectActiveFilter)
        .put(applyFilterRefreshStop())
        .put(applyFilterRefresh())
        .run();
    });

    it('should dispatch fetchIncidents error', () => {
      const message = '404 Not Found';
      const error = new Error(message);

      return expectSaga(fetchIncidents)
        .provide([
          [select(makeSelectFilterParams), {}],
          [matchers.call.fn(authCall), throwError(error)],
        ])
        .select(makeSelectFilterParams)
        .call.like(authCall)
        .put(requestIncidentsError(message))
        .run();
    });

    it('should fetch incidents after page change', () =>
      expectSaga(watchRequestIncidentSaga)
        .provide([
          [select(makeSelectActiveFilter), {}],
          [matchers.call.fn(authCall), []],
        ])
        .put(requestIncidentsSuccess([]))
        .dispatch({ type: PAGE_INCIDENTS_CHANGED, payload: 4 })
        .silentRun());

    it('should fetch incidents after sort change', () =>
      expectSaga(watchRequestIncidentSaga)
        .provide([
          [select(makeSelectActiveFilter), {}],
          [matchers.call.fn(authCall), []],
        ])
        .put(requestIncidentsSuccess([]))
        .dispatch({
          type: ORDERING_INCIDENTS_CHANGED,
          payload: 'incident-id-in-asc-order',
        })
        .silentRun());
  });

  describe('searchIncidents', () => {
    it('should fetchIncidents success', () => {
      const q = 'Here be dragons';

      return expectSaga(searchIncidents, q)
        .provide([
          [matchers.call.fn(authCall), incidentsJSON],
        ])
        .call.like(authCall, CONFIGURATION.SEARCH_ENDPOINT, { q })
        .put(requestIncidentsSuccess(incidentsJSON))
        .run();
    });

    it('should dispatch fetchIncidents error', () => {
      const q = 'Here be dragons';
      const message = '404 Not Found';
      const error = new Error(message);

      return expectSaga(searchIncidents, q)
        .provide([
          [matchers.call.fn(authCall), throwError(error)],
        ])
        .call.like(authCall)
        .put(requestIncidentsError(message))
        .run();
    });
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
        .silentRun();
    });
  });
});
