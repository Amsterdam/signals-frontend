import { fromJS } from 'immutable';
import makeSelectSearch from './selectors';


describe('makeSelectSearch', () => {
  const selector = makeSelectSearch();
  it('should select the search', () => {
    const search = {
      foo: 'bar'
    };

    const mockedState = fromJS({
      search
    });
    expect(selector(mockedState)).toEqual(search);
  });
});
