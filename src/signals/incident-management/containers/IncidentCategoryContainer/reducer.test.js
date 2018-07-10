
import { fromJS } from 'immutable';
import indcidentEditContainerReducer, { initialState } from './reducer';

describe('indcidentEditContainerReducer', () => {
  it('returns the initial state', () => {
    expect(indcidentEditContainerReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
