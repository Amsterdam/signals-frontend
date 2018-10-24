import { all, put, takeLatest } from 'redux-saga/effects';

import { REQUEST_HISTORY_LIST } from './constants';
import { requestHistoryListError, requestHistoryListSuccess } from './actions';
import watchRequestIncidentSaga, { baseUrl, fetchIncidentHistoryList } from './saga';
import { authCall } from '../../../../shared/services/api/api';

jest.mock('shared/services/api/api');
jest.mock('./selectors', () => {
  function mockedMakeSelectFilterParams() { }
  return ({
    makeSelectFilterParams: () => mockedMakeSelectFilterParams,
  });
});


describe('IncidentHistoryContainer saga', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should watchIncidentHistoryContainerSaga', () => {
    const gen = watchRequestIncidentSaga();
    expect(gen.next().value).toEqual(all([
      takeLatest(REQUEST_HISTORY_LIST, fetchIncidentHistoryList)
    ])); // eslint-disable-line redux-saga/yield-effects
  });

  it('should fetchIncidentHistoryList success', () => {
    const requestURL = `${baseUrl}`;
    const note = { note: 'Note 1' };
    const updatedNote = { note: 'Note 1' };
    const action = { payload: note };

    const gen = fetchIncidentHistoryList(action);
    expect(gen.next().value).toEqual(authCall(requestURL, note)); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next(note).value).toEqual(put(requestHistoryListSuccess(updatedNote))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should fetchIncidentHistoryList error', () => {
    const signalId = 1000;
    const action = { payload: { _signal__id: signalId } };
    const error = new Error('404 Not Found');

    const gen = fetchIncidentHistoryList(action);
    gen.next();
    expect(gen.throw(error).value).toEqual(put(requestHistoryListError(error))); // eslint-disable-line redux-saga/yield-effects
  });
});
