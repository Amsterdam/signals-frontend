import { fromJS } from 'immutable';
import {
  REQUEST_DASHBOARD,
  REQUEST_DASHBOARD_SUCCESS,
  REQUEST_DASHBOARD_ERROR
} from './constants';
import statusList from '../../definitions/statusList';

export const initialState = fromJS({
  dashboard: {},
  statusList,
  loading: false,
  error: false
});

function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_DASHBOARD:
      return state
        .set('loading', true);

    case REQUEST_DASHBOARD_SUCCESS:
      return state
        .set('dashboard', fromJS(action.payload))
        .set('loading', false);

    case REQUEST_DASHBOARD_ERROR:
      return state
        .set('loading', false)
        .set('error', true);

    default:
      return state;
  }
}

export default dashboardReducer;
