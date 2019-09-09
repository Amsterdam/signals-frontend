import { put, takeLatest, select, all } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { authCall, authPostCall, authDeleteCall } from 'shared/services/api/api';

import { REQUEST_INCIDENTS, INCIDENT_SELECTED, GET_FILTERS, REMOVE_FILTER, REVERT_FILTER } from './constants';
import { requestIncidentsSuccess, requestIncidentsError, filterIncidentsChanged, pageIncidentsChanged, sortIncidentsChanged, getFiltersSuccess, getFiltersFailed, removeFilterSuccess, removeFilterFailed, revertFilterSuccess, revertFilterFailed } from './actions';
import watchRequestIncidentSaga, { fetchIncidents, openIncident, getFilters, removeFilter, revertFilter } from './saga';
import { makeSelectFilterParams } from './selectors';

jest.mock('shared/services/api/api');
jest.mock('./selectors', () => {
  function mockedMakeSelectFilterParams() { }
  return ({
    makeSelectFilterParams: () => mockedMakeSelectFilterParams,
  });
});


describe('IncidentOverviewPage saga', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should watchRequestIncidentsSaga', () => {
    const gen = watchRequestIncidentSaga();
    expect(gen.next().value).toEqual(
      all(
        [
          takeLatest(REQUEST_INCIDENTS, fetchIncidents),
          takeLatest(INCIDENT_SELECTED, openIncident),
          takeLatest(GET_FILTERS, getFilters),
          takeLatest(REMOVE_FILTER, removeFilter),
          takeLatest(REVERT_FILTER, revertFilter),
        ]
      ));
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
    const filter = { name: 'filter' };
    const page = 2;
    const sort = '-created_at';
    const action = { payload: { filter, page, sort } };
    const incidents = {};

    const requestURL = 'https://acc.api.data.amsterdam.nl/signals/auth/signal';
    const params = { test: 'test' };

    const gen = fetchIncidents(action);
    expect(gen.next().value).toEqual(put(filterIncidentsChanged(filter))); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next().value).toEqual(put(pageIncidentsChanged(page))); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next().value).toEqual(put(sortIncidentsChanged(sort))); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next().value).toEqual(select(makeSelectFilterParams())); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next(params).value).toEqual(authCall(requestURL, params)); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next(incidents).value).toEqual(put(requestIncidentsSuccess(incidents))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should fetchIncidents success with sort days_open', () => {
    const filter = { name: 'filter' };
    const page = 2;
    const sort = 'days_open';
    const action = { payload: { filter, page, sort } };

    const requestURL = 'https://acc.api.data.amsterdam.nl/signals/auth/signal';
    const params = { ordering: 'days_open' };

    const gen = fetchIncidents(action);
    expect(gen.next().value).toEqual(put(filterIncidentsChanged(filter))); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next().value).toEqual(put(pageIncidentsChanged(page))); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next().value).toEqual(put(sortIncidentsChanged(sort))); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next().value).toEqual(select(makeSelectFilterParams())); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next(params).value).toEqual(authCall(requestURL, params)); // eslint-disable-line redux-saga/yield-effects
    expect(params).toEqual({
      ordering: '-created_at'
    });
  });

  it('should fetchIncidents success with sort -days_open', () => {
    const filter = { name: 'filter' };
    const page = 2;
    const sort = '-days_open';
    const action = { payload: { filter, page, sort } };

    const requestURL = 'https://acc.api.data.amsterdam.nl/signals/auth/signal';
    const params = { ordering: '-days_open' };

    const gen = fetchIncidents(action);
    expect(gen.next().value).toEqual(put(filterIncidentsChanged(filter))); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next().value).toEqual(put(pageIncidentsChanged(page))); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next().value).toEqual(put(sortIncidentsChanged(sort))); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next().value).toEqual(select(makeSelectFilterParams())); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next(params).value).toEqual(authCall(requestURL, params)); // eslint-disable-line redux-saga/yield-effects
    expect(params).toEqual({
      ordering: 'created_at'
    });
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
    const requestURL = 'https://acc.api.data.amsterdam.nl/signals/v1/private/me/filters/';
    const filters = { results: [{ a: 1 }] };

    const gen = getFilters();
    expect(gen.next().value).toEqual(authCall(requestURL)); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next(filters).value).toEqual(put(getFiltersSuccess(filters.results))); // eslint-disable-line redux-saga/yield-effects
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

    const gen = removeFilter(action);
    expect(gen.next(0).value).toEqual(authDeleteCall(requestURL)); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next().value).toEqual(put(removeFilterSuccess(id))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should removeFilter error', () => {
    const error = new Error('404 Not Found');

    const gen = removeFilter(666);
    gen.next();
    expect(gen.throw(error).value).toEqual(put(removeFilterFailed())); // eslint-disable-line redux-saga/yield-effects
  });

  it('should revertFilter success', () => {
    const requestURL = 'https://acc.api.data.amsterdam.nl/signals/v1/private/me/filters';
    const action = { payload: { name: 'filter' } };

    const gen = revertFilter(action);
    expect(gen.next().value).toEqual(authPostCall(requestURL)); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next().value).toEqual(put(revertFilterSuccess())); // eslint-disable-line redux-saga/yield-effects
  });

  it('should revertFilter error', () => {
    const error = new Error('404 Not Found');

    const gen = revertFilter(666);
    gen.next();
    expect(gen.throw(error).value).toEqual(put(revertFilterFailed())); // eslint-disable-line redux-saga/yield-effects
  });
});
