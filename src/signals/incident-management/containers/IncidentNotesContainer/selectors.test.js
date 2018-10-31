import { fromJS } from 'immutable';
import makeSelectIncidentNotesContainer from './selectors';

describe('makeSelectIncidentNotesContainer', () => {
  it('should select the notes container', () => {
    const selector = makeSelectIncidentNotesContainer();
    const incidentNotesContainer = {
      incidentStatusList: []
    };
    const mockedState = fromJS({
      incidentNotesContainer
    });

    expect(selector(mockedState)).toEqual(incidentNotesContainer);
  });
});
