/*
 *
 * OverviewPage reducer
 *
 */

import { fromJS } from 'immutable';
import { REQUEST_INCIDENTS, REQUEST_INCIDENTS_SUCCESS, REQUEST_INCIDENTS_ERROR, SELECT_INCIDENT, FILTER_INCIDENTS } from './constants';

const initialState = fromJS({ incidents: [] });

function overviewPageReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_INCIDENTS:
      return state
        .set('loading', true)
        .set('error', false)
        .set('incidents', []);
    case REQUEST_INCIDENTS_SUCCESS:
      return state
        .set('incidents', action.incidents)
        .set('loading', false);
    case REQUEST_INCIDENTS_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    case SELECT_INCIDENT:
      return state
        .set('selectedIncident', action.incident);
    case FILTER_INCIDENTS:
      return state
        .set('filter', action.filter);

    default:
      return state;
  }
}

export default overviewPageReducer;
