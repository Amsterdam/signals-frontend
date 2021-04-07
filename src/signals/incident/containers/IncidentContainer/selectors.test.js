// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
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
      const state = { incidentContainer };

      expect(selectIncidentContainerDomain(state)).toEqual(
        incidentContainer
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
