import { fromJS } from 'immutable';
import searchReducer, { initialState } from '../reducer';

import { SET_QUERY, RESET_QUERY } from '../constants';

describe('models/search/reducer', () => {
  it('returns the initial state', () => {
    expect(searchReducer(undefined, {})).toEqual(initialState);
  });

  it('should SET_QUERY', () => {
    const query = 'bar';
    const payload = query;

    expect(
      searchReducer(fromJS({}), {
        type: SET_QUERY,
        payload,
      }).toJS(),
    ).toEqual({
      query,
    });
  });

  it('should RESET_QUERY', () => {
    expect(
      searchReducer(fromJS({}), {
        type: RESET_QUERY,
      }).toJS(),
    ).toEqual(initialState.toJS());
  });
});
