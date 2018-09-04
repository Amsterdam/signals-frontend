import { call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { REQUEST_CATEGORY_UPDATE } from './constants';
import { requestCategoryUpdateSuccess, requestCategoryUpdateError } from './actions';
import watchIncidentCategorySaga, { baseUrl, updateIncidentCategory } from './saga';
import { authPostCall } from '../../../../shared/services/api/api';

jest.mock('shared/services/api/api');

describe('IncidentCategoryContainer saga', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should watchIncidentCategorySaga', () => {
    const gen = watchIncidentCategorySaga();
    expect(gen.next().value).toEqual(takeLatest(REQUEST_CATEGORY_UPDATE, updateIncidentCategory)); // eslint-disable-line redux-saga/yield-effects
  });

  it('should updateIncidentCategory success', () => {
    const category = { category: 'test' };
    const action = { payload: category };
    const updatedStatus = { category: 'updated' };
    const requestURL = `${baseUrl}/`;

    const gen = updateIncidentCategory(action);
    expect(gen.next().value).toEqual(authPostCall(requestURL, category)); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next().value).toEqual(call(delay, 1000)); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next(updatedStatus).value).toEqual(put(requestCategoryUpdateSuccess(updatedStatus))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should createIncidentStatus error', () => {
    const action = { payload: { } };
    const error = new Error('404 Not Found');

    const gen = updateIncidentCategory(action);
    gen.next();
    expect(gen.throw(error).value).toEqual(put(requestCategoryUpdateError(error))); // eslint-disable-line redux-saga/yield-effects
  });
});
