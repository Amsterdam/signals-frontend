
import { fromJS } from 'immutable';
import listContainerReducer from './reducer';

describe('listContainerReducer', () => {
  it('returns the initial state', () => {
    expect(listContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
