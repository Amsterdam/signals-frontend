import { fromJS } from 'immutable';
import makeSelectOverviewPage from './selectors';

describe('makeSelectOverviewPage', () => {
  it('should select the incidentOverviewPage', () => {
    const selector = makeSelectOverviewPage();
    const incidentOverviewPage = {
      incidents: [],
    };
    const mockedState = fromJS({
      incidentOverviewPage,
    });

    expect(selector(mockedState)).toEqual(incidentOverviewPage);
  });
});
