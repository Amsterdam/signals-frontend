import { fromJS } from 'immutable';
import { selectIncidentPriorityContainerDomain } from './selectors';

describe('selectIncidentPriorityContainerDomain', () => {
  it('should select the incidentPriority state', () => {
    const incidentPriorityContainer = fromJS({});
    const mockedState = fromJS({
      incidentPriorityContainer,
    });
    expect(selectIncidentPriorityContainerDomain(mockedState)).toEqual(incidentPriorityContainer);
  });
});
