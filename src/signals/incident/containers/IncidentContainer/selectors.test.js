import { fromJS } from 'immutable';
import { makeSelectIncidentContainer } from './selectors';

describe('signals/incident/containers/IncidentContainer/selectors', () => {
  it('should select the incidentContainer', () => {
    const state = {
      incidentContainer: {
        incident: {
          categoy: 'poep',
        },
      },
    };
    const mockedState = fromJS(state);

    expect(makeSelectIncidentContainer.resultFunc(mockedState)).toEqual(state);
  });
});
