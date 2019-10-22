import { fromJS } from 'immutable';
import makeSelectKtoContainer from './selectors';

describe('makeSelectKtoContainer', () => {
  it('should select the ktoContainer', () => {
    const selector = makeSelectKtoContainer();
    const ktoContainer = {
      form: {
        yesNo: 'ja',
      },
    };
    const mockedState = fromJS({
      ktoContainer,
    });

    expect(selector(mockedState)).toEqual(ktoContainer);
  });
});
