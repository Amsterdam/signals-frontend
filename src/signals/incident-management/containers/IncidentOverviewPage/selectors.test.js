import { fromJS } from 'immutable';
import makeSelectOverviewPage, { makeSelectFilterParams } from './selectors';

describe('makeSelectOverviewPage', () => {
  it('should select the overviewPage', () => {
    const selector = makeSelectOverviewPage();
    const overviewPage = {
      incidents: []
    };
    const mockedState = fromJS({
      overviewPage
    });

    expect(selector(mockedState)).toEqual(overviewPage);
  });
});

describe('makeSelectFilterParams', () => {
  it('should select the overviewPage', () => {
    const selector = makeSelectFilterParams();
    const overviewPage = {
      page: 333
    };
    const mockedState = fromJS({
      overviewPage
    });

    expect(selector(mockedState)).toEqual(overviewPage);
  });
});
