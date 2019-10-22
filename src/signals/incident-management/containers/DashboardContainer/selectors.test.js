import { fromJS } from 'immutable';
import makeSelectDashboardContainer from './selectors';

describe('makeSelectDashboardContainer', () => {
  it('should select the category container', () => {
    const selector = makeSelectDashboardContainer();
    const incidentDashboardContainer = {
      dashboard: {},
    };
    const mockedState = fromJS({
      incidentDashboardContainer,
    });

    expect(selector(mockedState)).toEqual(incidentDashboardContainer);
  });
});
