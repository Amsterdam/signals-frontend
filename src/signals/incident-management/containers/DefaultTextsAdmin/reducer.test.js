import defaultTextsAdminReducer, { initialState } from './reducer';

describe('defaultTextsAdminReducer', () => {
  it('returns the initial state', () => {
    expect(defaultTextsAdminReducer(undefined, {})).toEqual(initialState);
  });
});
