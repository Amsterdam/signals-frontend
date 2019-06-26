import { put, takeLatest } from 'redux-saga/effects';

import { REQUEST_HISTORY_LIST } from './constants';
import { requestHistoryListError, requestHistoryListSuccess } from './actions';
import watchHistorySaga, { fetchHistoryList } from './saga';
import { authCall } from '../../shared/services/api/api';

jest.mock('shared/services/api/api');
jest.mock('./selectors', () => {
  function mockedMakeSelectFilterParams() { }
  return ({
    makeSelectFilterParams: () => mockedMakeSelectFilterParams,
  });
});


describe('history saga', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should watchIncidentHistoryContainerSaga', () => {
    const gen = watchHistorySaga();
    expect(gen.next().value).toEqual(
      takeLatest(REQUEST_HISTORY_LIST, fetchHistoryList)
    ); // eslint-disable-line redux-saga/yield-effects
  });

  it('should fetchHistoryList success', () => {
    const list = { results: [], count: 55 };
    const action = { payload: 42 };

    const gen = fetchHistoryList(action);
    expect(gen.next().value).toEqual(authCall()); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next(list).value).toEqual(put(requestHistoryListSuccess(list))); // eslint-disable-line redux-saga/yield-effects
    gen.next();
  });

  it('should fetchHistoryList error', () => {
    const action = { payload: 42 };
    const error = new Error('404 Not Found');

    const gen = fetchHistoryList(action);
    gen.next();
    expect(gen.throw(error).value).toEqual(put(requestHistoryListError(error))); // eslint-disable-line redux-saga/yield-effects
  });
});
