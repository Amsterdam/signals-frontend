import produce from 'immer';
import {
  UPDATE_KTO,
  REQUEST_KTO_ANSWERS,
  REQUEST_KTO_ANSWERS_SUCCESS,
  REQUEST_KTO_ANSWERS_ERROR,
  CHECK_KTO,
  CHECK_KTO_SUCCESS,
  CHECK_KTO_ERROR,
  STORE_KTO,
  STORE_KTO_SUCCESS,
  STORE_KTO_ERROR,
} from './constants';

export const initialState = {
  form: {},
  loading: false,
  error: false,
  uuid: '',
  statusError: false,
  ktoFinished: false,
  ktoError: false,
  answers: {},
};

/* eslint-disable default-case, no-param-reassign */
export default (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_KTO:
        draft.form = {
          ...state.form,
          ...action.payload,
        };
        break;

      case REQUEST_KTO_ANSWERS:
        draft.form = {
          ...state.form,
          is_satisfied: action.payload,
        };
        break;

      case REQUEST_KTO_ANSWERS_SUCCESS:
        draft.answers = action.payload;
        break;

      case REQUEST_KTO_ANSWERS_ERROR:
        draft.error = true;
        break;

      case CHECK_KTO:
        draft.uuid = action.payload;
        draft.statusError = null;
        break;

      case CHECK_KTO_SUCCESS:
        draft.statusError = null;
        break;

      case CHECK_KTO_ERROR:
        draft.statusError = action.payload;
        break;

      case STORE_KTO:
        draft.ktoError = false;
        draft.ktoFinished = false;
        break;

      case STORE_KTO_SUCCESS:
        draft.ktoError = false;
        draft.ktoFinished = true;
        break;

      case STORE_KTO_ERROR:
        draft.ktoError = true;
        draft.ktoFinished = false;
        break;
    }
  });
