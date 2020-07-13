import { fromJS } from 'immutable';
import makeSelectHistoryModel from './selectors';

describe('makeSelectHistoryModel', () => {
  const selector = makeSelectHistoryModel();
  it('should select the history', () => {
    const history = {
      foo: 'bar',
    };

    const mockedState = fromJS({
      history,
    });
    expect(selector(mockedState)).toEqual(history);
  });
});
