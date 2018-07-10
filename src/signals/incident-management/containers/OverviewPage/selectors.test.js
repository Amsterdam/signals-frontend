import { fromJS } from 'immutable';
import makeSelectOverviewPage from './selectors';


describe('makeSelectOverviewPage', () => {
  const selector = makeSelectOverviewPage();
  it('should select the overviewPage', () => {
    const overviewPage = {
      foo: 'bar'
    };

    const mockedState = fromJS({
      overviewPage
    });
    expect(selector(mockedState)).toEqual(overviewPage);
  });
});
