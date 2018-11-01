import { fromJS } from 'immutable';
import makeSelectIncidentContainer from './selectors';

describe('makeSelectIncidentContainer', () => {
  it('should select the incidentContainer', () => {
    const selector = makeSelectIncidentContainer();
    const incidentContainer = {
      incident: {
        categoy: 'poep'
      }
    };
    const mockedState = fromJS({
      incidentContainer
    });

    expect(selector(mockedState)).toEqual(incidentContainer);
  });
});
