
import { fromJS } from 'immutable';
import overviewPageReducer from './reducer';

describe('overviewPageReducer', () => {
  it('returns the initial state', () => {
    expect(overviewPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
