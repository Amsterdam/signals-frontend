import makeSelectHistoryModel from './selectors';

describe('makeSelectHistoryModel', () => {
  const selector = makeSelectHistoryModel();
  it('should select the history', () => {
    const history = {
      foo: 'bar',
    };

    const mockedState = {
      history,
    };
    expect(selector(mockedState)).toEqual(history);
  });
});
