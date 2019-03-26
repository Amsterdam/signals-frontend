import { fromJS } from 'immutable';
import {
  UPDATE_KTA,
  REQUEST_KTA_ANSWERS, REQUEST_KTA_ANSWERS_SUCCESS, REQUEST_KTA_ANSWERS_ERROR,
  CHECK_KTO, CHECK_KTO_SUCCESS, CHECK_KTO_ERROR,
  STORE_KTO, STORE_KTO_SUCCESS, STORE_KTO_ERROR
} from './constants';

const initialState = fromJS({
  form: {},
  loading: false,
  error: false,
  uuid: '',
  statusError: false,
  ktoFinished: false,
  ktoError: false,
  answers: {}
});

function ktoContainerReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_KTA:
      return state
        .set('form', fromJS({
          ...state.get('form').toJS(),
          ...action.payload
        }));

    case REQUEST_KTA_ANSWERS:
      return state
        .set('form', fromJS({
          ...state.get('form').toJS(),
          yesNo: action.payload
        }));

    case REQUEST_KTA_ANSWERS_SUCCESS:
      return state
        .set('answers', fromJS(action.payload));

    case REQUEST_KTA_ANSWERS_ERROR:
      return state
        .set('error', fromJS(action.payload));

    case CHECK_KTO:
      return state
        .set('uuid', fromJS(action.payload))
        .set('statusError', null);

    case CHECK_KTO_SUCCESS:
      return state
        .set('statusError', null);

    case CHECK_KTO_ERROR:
      return state
        .set('statusError', fromJS(action.payload));

    case STORE_KTO:
      return state
        .set('ktoError', false)
        .set('ktoFinished', false);

    case STORE_KTO_SUCCESS:
      return state
      .set('ktoError', false)
      .set('ktoFinished', true);

    case STORE_KTO_ERROR:
      return state
      .set('ktoError', true)
      .set('ktoFinished', false);

    default:
      return state;
  }
}

export default ktoContainerReducer;
