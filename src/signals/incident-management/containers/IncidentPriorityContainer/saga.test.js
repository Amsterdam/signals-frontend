import { call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { REQUEST_PRIORITY_UPDATE } from './constants';
import { requestPriorityUpdateSuccess, requestPriorityUpdateError } from './actions';
import watchIncidentPrioritySaga, { baseUrl, updateIncidentPriority } from './saga';
import { authPostCall } from '../../../../shared/services/api/api';

jest.mock('shared/services/api/api');

describe('IncidentPriorityContainer saga', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should watchIncidentPrioritySaga', () => {
    const gen = watchIncidentPrioritySaga();
    expect(gen.next().value).toEqual(takeLatest(REQUEST_PRIORITY_UPDATE, updateIncidentPriority)); // eslint-disable-line redux-saga/yield-effects
  });

  it('should updateIncidentPriority success', () => {
    const priority = { priority: 'test' };
    const action = { payload: priority };
    const updatedPriority = { priority: 'updated' };
    const requestURL = `${baseUrl}/`;

    const gen = updateIncidentPriority(action);
    expect(gen.next().value).toEqual(authPostCall(requestURL, priority)); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next(updatedPriority).value).toEqual(call(delay, 1000)); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next().value).toEqual(put(requestPriorityUpdateSuccess(updatedPriority))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should createIncidentStatus error', () => {
    const action = { payload: { } };
    const error = new Error('404 Not Found');

    const gen = updateIncidentPriority(action);
    gen.next();
    expect(gen.throw(error).value).toEqual(put(requestPriorityUpdateError(error))); // eslint-disable-line redux-saga/yield-effects
  });
});
