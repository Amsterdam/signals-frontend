import { fromJS } from 'immutable';

import { SET_SEARCH_QUERY, RESET_SEARCH_QUERY } from 'containers/App/constants';

import {
  GET_DISTRICTS_FAILED,
  GET_DISTRICTS_SUCCESS,
  APPLY_FILTER,
  CLEAR_EDIT_FILTER,
  EDIT_FILTER,
  FILTER_EDIT_CANCELED,
  GET_FILTERS_FAILED,
  GET_FILTERS_SUCCESS,
  ORDERING_CHANGED,
  PAGE_CHANGED,
  REMOVE_FILTER_SUCCESS,
  REQUEST_INCIDENTS_ERROR,
  REQUEST_INCIDENTS_SUCCESS,
  SAVE_FILTER_FAILED,
  SAVE_FILTER_SUCCESS,
  SEARCH_INCIDENTS_ERROR,
  SEARCH_INCIDENTS_SUCCESS,
  REQUEST_INCIDENTS,
  UPDATE_FILTER_FAILED,
  UPDATE_FILTER_SUCCESS,
} from './constants';

export const initialState = fromJS({
  activeFilter: {
    // filter settings for the list of incidents
    name: '',
    options: {},
  },
  districts: [],
  districtsLoading: false,
  editFilter: {
    // settings selected for editing
    name: '',
    options: {},
  },
  filters: [],
  filtersLoading: false,
  incidents: {
    count: undefined,
    results: [],
  },
  incidentsLoading: false,
  loading: false,
  ordering: '-created_at',
  page: 1,
});

const updateLoading = state =>
  state.set('loading', state.get('districtsLoading') || state.get('filtersLoading') || state.get('incidentsLoading'));

export default (state = initialState, action) => {
  let newFilters;
  let re;

  switch (action.type) {
    case GET_DISTRICTS_SUCCESS:
      return updateLoading(state.set('districts', fromJS(action.payload)).set('districtsLoading', false));

    case GET_DISTRICTS_FAILED:
      return updateLoading(state.set('districtsLoading', false).set('error', true).set('errorMessage', action.payload));

    case GET_FILTERS_SUCCESS:
      return updateLoading(state.set('filters', fromJS(action.payload)).set('filtersLoading', false));

    case REMOVE_FILTER_SUCCESS:
      re = new RegExp(`/${action.payload}`, 'g');
      newFilters = state
        .get('filters')
        .toJS()
        .filter(i => !i._links.self.href.match(re));
      return state.set('filters', fromJS(newFilters));

    case APPLY_FILTER:
      return state
        .set('activeFilter', fromJS(action.payload))
        .set('editFilter', fromJS(action.payload))
        .set('ordering', initialState.get('ordering'))
        .set('page', initialState.get('page'));

    case EDIT_FILTER:
      return state.set('editFilter', fromJS(action.payload));

    case GET_FILTERS_FAILED:
    case SAVE_FILTER_FAILED:
    case UPDATE_FILTER_FAILED:
      return updateLoading(state.set('filtersLoading', false).set('error', true).set('errorMessage', action.payload));

    case SAVE_FILTER_SUCCESS:
    case UPDATE_FILTER_SUCCESS:
      return updateLoading(
        state
          .set('activeFilter', fromJS(action.payload))
          .set('error', false)
          .set('errorMessage', undefined)
          .set('filtersLoading', false)
      );

    case CLEAR_EDIT_FILTER:
      return updateLoading(
        state
          .set('editFilter', initialState.get('editFilter'))
          .set('error', false)
          .set('errorMessage', undefined)
          .set('filtersLoading', false)
      );

    case FILTER_EDIT_CANCELED:
      return state.set('editFilter', state.get('activeFilter'));

    case PAGE_CHANGED:
      return state.set('page', action.payload);

    case ORDERING_CHANGED:
      return state.set('page', initialState.get('page')).set('ordering', action.payload);

    case REQUEST_INCIDENTS:
      return updateLoading(state.set('incidentsLoading', true).set('error', false).set('errorMessage', undefined));

    case SEARCH_INCIDENTS_SUCCESS:
    case REQUEST_INCIDENTS_SUCCESS:
      return updateLoading(
        state
          .set('incidents', fromJS(action.payload))
          .set('incidentsLoading', false)
          .set('error', false)
          .set('errorMessage', undefined)
      );

    case SEARCH_INCIDENTS_ERROR:
    case REQUEST_INCIDENTS_ERROR:
      return updateLoading(state.set('error', true).set('errorMessage', action.payload).set('incidentsLoading', false));

    case SET_SEARCH_QUERY:
      return updateLoading(
        state
          .set('activeFilter', initialState.get('activeFilter'))
          .set('editFilter', initialState.get('editFilter'))
          .set('ordering', initialState.get('ordering'))
          .set('incidentsLoading', true)
          .set('page', initialState.get('page'))
      );

    case RESET_SEARCH_QUERY:
      return updateLoading(
        state
          .set('incidentsLoading', true)
          .set('ordering', initialState.get('ordering'))
          .set('page', initialState.get('page'))
      );

    default:
      return state;
  }
};
