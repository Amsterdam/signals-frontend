import { put, takeLatest, all } from 'redux-saga/effects';

import { REQUEST_STATUS_LIST, REQUEST_STATUS_CREATE } from './constants';
import { requestStatusListError, requestStatusListSuccess, requestStatusCreateSuccess, requestStatusCreateError } from './actions';
import watchRequestIncidentSaga, { baseUrl, fetchIncidentStatusList, createIncidentStatus } from './saga';
import { authPostCall, authCall } from '../../../../shared/services/api/api';

jest.mock('shared/services/api/api');
jest.mock('./selectors', () => {
  function mockedMakeSelectFilterParams() { }
  return ({
    makeSelectFilterParams: () => mockedMakeSelectFilterParams,
  });
});


describe('IncidentStatusContainer saga', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should watchIncidentStatusContainerSaga', () => {
    const gen = watchRequestIncidentSaga();
    expect(gen.next().value).toEqual(all([takeLatest(REQUEST_STATUS_LIST, fetchIncidentStatusList), takeLatest(REQUEST_STATUS_CREATE, createIncidentStatus)])); // eslint-disable-line redux-saga/yield-effects
  });

  it('should createIncidentStatus success', () => {
    const status = { status: 1 };
    const action = { payload: status };
    const updatedStatus = { status: 2 };
    const requestURL = `${baseUrl}/`;

    const gen = createIncidentStatus(action);
    expect(gen.next().value).toEqual(authPostCall(requestURL, status)); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next(updatedStatus).value).toEqual(put(requestStatusCreateSuccess(updatedStatus))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should createIncidentStatus error', () => {
    const action = { payload: { } };
    const error = new Error('404 Not Found');

    const gen = createIncidentStatus(action);
    gen.next();
    expect(gen.throw(error).value).toEqual(put(requestStatusCreateError(error))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should fetchIncidentStatusList success', () => {
    const requestURL = `${baseUrl}`;
    const status = { status: 1 };
    const updatedStatus = { status: 2 };
    const action = { payload: status };

    const gen = fetchIncidentStatusList(action);
    expect(gen.next().value).toEqual(authCall(requestURL, status)); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next(updatedStatus).value).toEqual(put(requestStatusListSuccess(updatedStatus))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should fetchIncidentStatusList error', () => {
    const signalId = 1000;
    const action = { payload: { _signal__id: signalId } };
    const error = new Error('404 Not Found');

    const gen = fetchIncidentStatusList(action);
    gen.next();
    expect(gen.throw(error).value).toEqual(put(requestStatusListError(error))); // eslint-disable-line redux-saga/yield-effects
  });
});
