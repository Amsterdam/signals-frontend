import { fromJS } from 'immutable';
import ktoContainerReducer from './reducer';

import {
  DEFAULT_ACTION,
} from './constants';

describe('ktoContainerReducer', () => {
  it('returns the initial state', () => {
    expect(ktoContainerReducer(undefined, {})).toEqual(fromJS({}));
  });

  it('should DEFAULT_ACTION', () => {
    expect(
      ktoContainerReducer(fromJS({}), {
        type: DEFAULT_ACTION
      }).toJS()
    ).toEqual({
      foo: 'bar'
    });
  });
});
