import { fromJS } from 'immutable';
import { testActionCreator } from 'test/utils';

import { setSearchQuery, resetSearchQuery } from '../actions';
import { SET_QUERY, RESET_QUERY } from '../constants';

describe('models/search/actions', () => {
  it('should dispatch setSearchQuery action', () => {
    const query = 'bar';
    const payload = fromJS({ query });

    testActionCreator(setSearchQuery, SET_QUERY, payload);
  });

  it('should dispatch resetSearchQuery action', () => {
    testActionCreator(resetSearchQuery, RESET_QUERY);
  });
});
