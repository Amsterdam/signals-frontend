import { fromJS } from 'immutable';
import makeSelectOverviewPage, { makeSelectFilterParams } from './selectors';

describe('makeSelectOverviewPage', () => {
  it('should select the incidentOverviewPage', () => {
    const selector = makeSelectOverviewPage();
    const incidentOverviewPage = {
      incidents: []
    };
    const mockedState = fromJS({
      incidentOverviewPage
    });

    expect(selector(mockedState)).toEqual(incidentOverviewPage);
  });
});

describe('makeSelectFilterParams', () => {
  it('should select the incidentOverviewPage', () => {
    const selector = makeSelectFilterParams();
    const incidentOverviewPage = {
      page: 333
    };
    const mockedState = fromJS({
      incidentOverviewPage
    });

    expect(selector(mockedState)).toEqual(incidentOverviewPage);
  });
});
