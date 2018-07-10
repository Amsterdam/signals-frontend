
import { fromJS } from 'immutable';
import mapContainerReducer from './reducer';

describe('mapContainerReducer', () => {
  it('returns the initial state', () => {
    expect(mapContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
