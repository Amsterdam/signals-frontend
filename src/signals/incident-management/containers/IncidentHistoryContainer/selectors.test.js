import { fromJS } from 'immutable';
import makeSelectIncidentHistoryContainer from './selectors';

describe('makeSelectIncidentHistoryContainer', () => {
  it('should select the category container', () => {
    const selector = makeSelectIncidentHistoryContainer();
    const incidentHistoryContainer = {
      incidentHistoryList: []
    };
    const mockedState = fromJS({
      incidentHistoryContainer
    });

    expect(selector(mockedState)).toEqual(incidentHistoryContainer);
  });
});
