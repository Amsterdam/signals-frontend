import { fromJS } from 'immutable';
import {
  PAGE_INCIDENTS_CHANGED,
  REQUEST_INCIDENTS_ERROR,
  REQUEST_INCIDENTS_SUCCESS,
  REQUEST_INCIDENTS,
  SORT_INCIDENTS_CHANGED,
} from './constants';

export const initialState = fromJS({
  error: false,
  errorMessage: undefined,
  incidents: [],
  incidentsCount: null,
  loading: false,
  page: 1,
  sort: '-created_at',
});

export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_INCIDENTS:
      return state
        .set('loading', true)
        .set('error', false)
        .set('errorMessage', undefined);

    case REQUEST_INCIDENTS_SUCCESS:
      return state
        .set('incidents', fromJS(action.payload.results))
        .set('incidentsCount', action.payload.count)
        .set('loading', false)
        .set('error', false)
        .set('errorMessage', undefined);

    case REQUEST_INCIDENTS_ERROR:
      return state
        .set('error', true)
        .set('errorMessage', action.payload)
        .set('loading', false);

    case PAGE_INCIDENTS_CHANGED:
      return state.set('page', fromJS(action.payload));

    case SORT_INCIDENTS_CHANGED:
      return state.set('page', 1).set('sort', fromJS(action.payload));

    default:
      return state;
  }
};
