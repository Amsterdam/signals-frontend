import { put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { SET_QUERY } from '../constants';
import watchSearchSaga, { setQuery } from '../saga';

describe('search saga', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should watchIncidentHistoryContainerSaga', () => {
    const gen = watchSearchSaga();
    expect(gen.next().value).toEqual(
      takeLatest(SET_QUERY, setQuery)
    );
  });

  it('should navigate to incidents overvew when called', () => {
    const gen = setQuery();
    expect(gen.next().value).toEqual(put(push('/manage/incidents')));
    gen.next();
  });
});
