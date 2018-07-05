/*
 *
 * OverviewPage reducer
 *
 */

import { fromJS } from 'immutable';
import { REQUEST_INCIDENTS, REQUEST_INCIDENTS_SUCCESS, REQUEST_INCIDENTS_ERROR, FILTER_INCIDENTS_CHANGED, PAGE_INCIDENTS_CHANGED } from './constants';
import statusList from '../../definitions/statusList';

export const initialState = fromJS({ incidents: [],
  statusList });

function overviewPageReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_INCIDENTS:
      return state
        .set('loading', true)
        .set('error', false);
    case REQUEST_INCIDENTS_SUCCESS:
      return state
        .set('incidents', action.payload.results)
        .set('incidentsCount', action.payload.count)
        .set('loading', false);
    case REQUEST_INCIDENTS_ERROR:
      return state
        .set('error', action.payload)
        .set('loading', false);
    case FILTER_INCIDENTS_CHANGED:
      return state
        .set('filter', action.payload)
        .set('page', 1);
    case PAGE_INCIDENTS_CHANGED:
      return state
        .set('page', action.payload);

    default:
      return state;
  }
}

export default overviewPageReducer;
