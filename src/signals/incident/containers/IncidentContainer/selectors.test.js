import { fromJS } from 'immutable';
import { initialState } from './reducer';
import {
  selectIncidentContainerDomain,
  makeSelectIncidentContainer,
} from './selectors';

describe('signals/incident/containers/IncidentContainer/selectors', () => {
  describe('selectIncidentContainerDomain', () => {
    it('should return the initial state', () => {
      expect(selectIncidentContainerDomain()).toEqual(initialState);
    });

    it('should return incidentContainer', () => {
      const incidentContainer = { incident: { foo: 'bar' } };
      const state = fromJS({ incidentContainer });

      expect(selectIncidentContainerDomain(state)).toEqual(
        fromJS(incidentContainer)
      );
    });
  });

  describe('makeSelectIncidentContainer', () => {
    it('should select the incidentContainer', () => {
      const state = {
        incidentContainer: {
          incident: {
            categoy: 'poep',
          },
        },
      };
      const mockedState = fromJS(state);

      expect(makeSelectIncidentContainer.resultFunc(mockedState)).toEqual(
        state
      );
    });
  });
});
