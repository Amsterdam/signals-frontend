import { fromJS } from 'immutable';
import { initialState } from '../reducer';
import selectSearchDomain, {
  makeSelectSearch,
  makeSelectQuery,
} from '../selectors';

describe('models/search/selectors', () => {
  it('should return the search model', () => {
    const search = {
      query: 'bar',
    };

    const mockedState = fromJS({
      search,
    });
    expect(makeSelectSearch(mockedState)).toEqual(search);
  });

  it('should return the search query', () => {
    const query = 'bar';
    const search = {
      query,
    };

    const mockedState = fromJS({
      search,
    });
    expect(makeSelectQuery(mockedState)).toEqual(query);
  });

  it('should return the initial state', () => {
    expect(selectSearchDomain()).toEqual(initialState);
  });
});
