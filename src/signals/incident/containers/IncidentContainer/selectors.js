import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectIncidentContainerDomain = state => (state && state.get('incidentContainer') )|| initialState;

export const makeSelectIncidentContainer = createSelector(
  selectIncidentContainerDomain,
  substate => substate.toJS()
);
