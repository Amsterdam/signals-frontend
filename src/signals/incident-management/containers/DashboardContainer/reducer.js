import { fromJS } from 'immutable';
import {
  REQUEST_DASHBOARD,
  REQUEST_DASHBOARD_SUCCESS,
  REQUEST_DASHBOARD_ERROR
} from './constants';

export const initialState = fromJS({
  dashboard: {},
  firstTime: true,
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
        .set('loading', false)
        .set('firstTime', false);

    case REQUEST_DASHBOARD_ERROR:
      return state
        .set('error', true);

    default:
      return state;
  }
}

export default dashboardReducer;
