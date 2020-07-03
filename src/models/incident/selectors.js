import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectIncidentDomain = state => state.get('incidentModel') || initialState;

const makeSelectIncidentModel = createSelector(selectIncidentDomain, substate => substate.toJS());

export default makeSelectIncidentModel;
export { selectIncidentDomain };
