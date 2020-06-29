import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectIncidentDomain = state => state.get('incidentModel') || initialState;

const makeSelectIncidentModel = createSelector(selectIncidentDomain, substate => substate.toJS());

export const makeSelectPatching = createSelector(selectIncidentDomain, substate => substate.get('patching').toJS());
export const makeSelectPatchLoading = createSelector(selectIncidentDomain, substate => substate.get('patchLoading'));

export default makeSelectIncidentModel;
export { selectIncidentDomain };
