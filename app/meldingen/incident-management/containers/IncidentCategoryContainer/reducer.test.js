
import { fromJS } from 'immutable';
import indcidentEditContainerReducer from './reducer';

describe('indcidentEditContainerReducer', () => {
  it('returns the initial state', () => {
    expect(indcidentEditContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
