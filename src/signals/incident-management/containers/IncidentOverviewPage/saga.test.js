import { put, takeLatest, select, all } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { authCall } from 'shared/services/api/api';

import { REQUEST_INCIDENTS, INCIDENT_SELECTED } from './constants';
import { requestIncidentsSuccess, requestIncidentsError, filterIncidentsChanged, pageIncidentsChanged, sortIncidentsChanged } from './actions';
import watchRequestIncidentSaga, { fetchIncidents, openIncident } from './saga';
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
    expect(gen.next().value).toEqual(all([takeLatest(REQUEST_INCIDENTS, fetchIncidents), takeLatest(INCIDENT_SELECTED, openIncident)])); // eslint-disable-line redux-saga/yield-effects
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

    const requestURL = 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals';
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

    const requestURL = 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals';
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

    const requestURL = 'https://acc.api.data.amsterdam.nl/signals/v1/private/signals';
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
});
