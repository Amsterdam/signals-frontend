import { fromJS } from 'immutable';

import appReducer, { initialState } from './reducer';

describe('appReducer', () => {
  beforeEach(() => {
  });

  it('should return the initial state', () => {
    expect(appReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
