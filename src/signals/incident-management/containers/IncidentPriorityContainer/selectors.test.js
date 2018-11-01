import { fromJS } from 'immutable';
import makeSelectIncidentPriorityContainer from './selectors';

describe('makeSelectIncidentPriorityContainer', () => {
  it('should select the priority container', () => {
    const selector = makeSelectIncidentPriorityContainer();
    const incidentPriorityContainer = {
      priorityList: []
    };
    const mockedState = fromJS({
      incidentPriorityContainer
    });

    expect(selector(mockedState)).toEqual(incidentPriorityContainer);
  });
});
