
import { fromJS } from 'immutable';
import filterContainerReducer from './reducer';

describe('filterContainerReducer', () => {
  it('returns the initial state', () => {
    expect(filterContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
