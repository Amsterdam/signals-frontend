import { fromJS } from 'immutable';
import defaultTextsAdminReducer, { initialState } from './reducer';

// import {
  // DEFAULT_ACTION,
// } from './constants';

describe('defaultTextsAdminReducer', () => {
  it('returns the initial state', () => {
    expect(defaultTextsAdminReducer(undefined, {})).toEqual(fromJS(initialState));
  });

  // it('should DEFAULT_ACTION', () => {
    // expect(
      // defaultTextsAdminReducer(fromJS({}), {
        // type: DEFAULT_ACTION
      // }).toJS()
    // ).toEqual({
      // foo: 'bar'
    // });
  // });
});
