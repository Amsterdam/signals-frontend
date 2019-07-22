import makeSelectKtoContainer from './selectors';

describe('makeSelectKtoContainer', () => {
  it('should select the ktoContainer', () => {
    const selector = makeSelectKtoContainer();
    const ktoContainer = {
      form: {
        yesNo: 'ja'
      }
    };
    const mockedState = {
      ktoContainer
    };

    expect(selector(mockedState)).toEqual(ktoContainer);
  });
});
