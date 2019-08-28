import { fromJS } from 'immutable';
import searchReducer from './reducer';

import {
  DEFAULT_ACTION,
} from './constants';

describe('searchReducer', () => {
  it('returns the initial state', () => {
    expect(searchReducer(undefined, {})).toEqual(fromJS({}));
  });

  it('should DEFAULT_ACTION', () => {
    expect(
      searchReducer(fromJS({}), {
        type: DEFAULT_ACTION
      }).toJS()
    ).toEqual({
      foo: 'bar'
    });
  });
});
