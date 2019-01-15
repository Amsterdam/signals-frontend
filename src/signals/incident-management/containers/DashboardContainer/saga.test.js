import { put, takeLatest } from 'redux-saga/effects';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { REQUEST_DASHBOARD } from './constants';
import { requestDashboardSuccess, requestDashboardError } from './actions';
import watchDashboardSaga, { fetchDashboard } from './saga';
import { authCall } from '../../../../shared/services/api/api';

jest.mock('shared/services/api/api');

describe('DashboardContainer saga', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should watchDashboardSaga', () => {
    const gen = watchDashboardSaga();
    expect(gen.next().value).toEqual(takeLatest(REQUEST_DASHBOARD, fetchDashboard)); // eslint-disable-line redux-saga/yield-effects
  });

  it('should fetchDashboard success', () => {
    const result = {
      status: [],
      category: [],
      hour: [],
      today: {}
    };
    const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/experimental/dashboards/1/`;

    const gen = fetchDashboard();
    expect(gen.next().value).toEqual(authCall(requestURL)); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next(result).value).toEqual(put(requestDashboardSuccess(result))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should fetchDashboard error', () => {
    const error = new Error('404 Not Found');

    const gen = fetchDashboard();
    gen.next();
    expect(gen.throw(error).value).toEqual(put(requestDashboardError(error))); // eslint-disable-line redux-saga/yield-effects
  });
});
