import { fromJS } from 'immutable';

import { defaultTextsOptionList } from 'signals/incident-management/definitions/statusList';

import {
  DEFAULT_ACTION,
} from './constants';


const initialState = fromJS({
  defaultTextsOptionList
});

function defaultTextsAdminReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default defaultTextsAdminReducer;
