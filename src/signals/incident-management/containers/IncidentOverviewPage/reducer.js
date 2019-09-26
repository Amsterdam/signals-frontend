import { fromJS } from 'immutable';
import {
  REQUEST_INCIDENTS,
  REQUEST_INCIDENTS_SUCCESS,
  REQUEST_INCIDENTS_ERROR,
  FILTER_INCIDENTS_CHANGED,
  PAGE_INCIDENTS_CHANGED,
  SORT_INCIDENTS_CHANGED,
} from './constants';

export const initialState = fromJS({
  sort: '-created_at',
  page: 1,
  incidents: [],
  incidentsCount: null,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_INCIDENTS:
      return state.set('loading', true).set('error', false);
    case REQUEST_INCIDENTS_SUCCESS:
      return state
        .set('incidents', fromJS(action.payload.results))
        .set('incidentsCount', action.payload.count)
        .set('loading', false);
    case REQUEST_INCIDENTS_ERROR:
      return state.set('error', action.payload).set('loading', false);
    case FILTER_INCIDENTS_CHANGED:
      return state.set('filter', fromJS(action.payload)).set('page', 1);
    case PAGE_INCIDENTS_CHANGED:
      return state.set('page', fromJS(action.payload));
    case SORT_INCIDENTS_CHANGED:
      return state.set('page', 1).set('sort', fromJS(action.payload));
    default:
      return state;
  }
};
