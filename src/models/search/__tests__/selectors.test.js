import { fromJS } from 'immutable';
import { initialState } from '../reducer';
import makeSelectSearch, { selectSearchDomain } from '../selectors';

describe('makeSelectSearch', () => {
  it('should select the search', () => {
    const search = {
      foo: 'bar',
    };

    const mockedState = fromJS({
      search,
    });
    expect(makeSelectSearch(mockedState)).toEqual(search);
  });

  it('should return the initial state', () => {
    expect(selectSearchDomain()).toEqual(initialState);
  });
});
