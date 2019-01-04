import { fromJS } from 'immutable';
import {
  REQUEST_DASHBOARD,
  REQUEST_DASHBOARD_SUCCESS
} from './constants';

const initialState = fromJS({
  dashboard: [],
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

    default:
      return state;
  }
}

export default dashboardReducer;
