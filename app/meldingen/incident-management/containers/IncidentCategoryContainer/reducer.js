import { fromJS } from 'immutable';
import {
  REQUEST_CATEGORY_UPDATE, REQUEST_CATEGORY_UPDATE_SUCCESS, REQUEST_CATEGORY_UPDATE_ERROR
}
  from './constants';
import subcategoryList from '../../definitions/subcategoryList';

const initialState = fromJS({
  subcategoryList
});

function incidentStatusContainerReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_CATEGORY_UPDATE:
      return state
        .set('loading', true)
        .set('error', false);
    case REQUEST_CATEGORY_UPDATE_SUCCESS:
      return state
        // .set('incident', fromJS({ ...state.get('incident'), category: action.payload }))
        .set('loading', false);

    case REQUEST_CATEGORY_UPDATE_ERROR:
      return state
        .set('error', action.payload)
        .set('loading', false);
    default:
      return state;
  }
}

export default incidentStatusContainerReducer;
