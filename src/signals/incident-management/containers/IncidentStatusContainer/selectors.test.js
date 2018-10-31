import { fromJS } from 'immutable';
import makeSelectIncidentStatusContainer from './selectors';

describe('makeSelectIncidentStatusContainer', () => {
  it('should select the category container', () => {
    const selector = makeSelectIncidentStatusContainer();
    const incidentStatusContainer = {
      incidentStatusList: []
    };
    const mockedState = fromJS({
      incidentStatusContainer
    });

    expect(selector(mockedState)).toEqual(incidentStatusContainer);
  });
});
