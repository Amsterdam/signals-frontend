import { put, takeLatest } from 'redux-saga/effects';

import { REQUEST_DASHBOARD } from './constants';
import { requestDashboardSuccess, requestDashboardError } from './actions';
import watchDashboardSaga, { requestURL, fetchDashboard } from './saga';
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
    const resultIn = {
      status: [],
      category: [],
      hour: [
        {
          dateTime: '2019-01-15T07:00:00+01:00',
          count: 45
        }
      ],
      today: {}
    };

    const resultOut = {
      status: [],
      category: [],
      hour: [
        {
          dateTime: '2019-01-15T07:00:00+01:00',
          count: 45,
          timestamp: 1547532000000
        }
      ],
      today: {}
    };

    const gen = fetchDashboard();
    expect(gen.next().value).toEqual(authCall(requestURL)); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next(resultIn).value).toEqual(put(requestDashboardSuccess(resultOut))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should fetchDashboard error', () => {
    const error = new Error('404 Not Found');

    const gen = fetchDashboard();
    gen.next();
    expect(gen.throw(error).value).toEqual(put(requestDashboardError(error))); // eslint-disable-line redux-saga/yield-effects
  });
});
