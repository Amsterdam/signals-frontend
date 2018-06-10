/*
 *
 * OverviewPage reducer
 *
 */

import { fromJS } from 'immutable';
import { REQUEST_INCIDENTS, REQUEST_INCIDENTS_SUCCESS, REQUEST_INCIDENTS_ERROR } from './constants';

const initialState = fromJS({incidents: []});

function overviewPageReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_INCIDENTS:
      return state
        .set('loading', true)
        .set('error', false)
        .set('incidents', false);
    case REQUEST_INCIDENTS_SUCCESS:
      return state
        .set('incidents', action.incidents)
        .set('loading', false);
    case REQUEST_INCIDENTS_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    default:
      return state;
  }
}

export default overviewPageReducer;
