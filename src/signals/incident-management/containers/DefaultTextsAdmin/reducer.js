import { fromJS } from 'immutable';

import { defaultTextsOptionList } from 'signals/incident-management/definitions/statusList';

import {
  FETCH_DEFAULT_TEXTS, FETCH_DEFAULT_TEXTS_SUCCESS, FETCH_DEFAULT_TEXTS_ERROR,
  STORE_DEFAULT_TEXTS, STORE_DEFAULT_TEXTS_SUCCESS, STORE_DEFAULT_TEXTS_ERROR,
  ORDER_DEFAULT_TEXTS, SAVE_DEFAULT_TEXTS_ITEM
} from './constants';

import { renumberOrder, sortByOrder } from './services/ordering-utils';

const initialState = fromJS({
  defaultTexts: [],
  loading: false,
  error: false,
  storing: false,
  defaultTextsOptionList
});

function defaultTextsAdminReducer(state = initialState, action) {
  let defaultTexts;
  let delta;
  let result;

  switch (action.type) {
    case FETCH_DEFAULT_TEXTS:
      return state
        .set('categoryUrl', fromJS(action.payload.category_url))
        .set('state', fromJS(action.payload.state))
        .set('loading', true)
        .set('error', false);

    case FETCH_DEFAULT_TEXTS_SUCCESS:
      return state
        .set('defaultTexts', fromJS(action.payload))
        .set('loading', false)
        .set('error', false);

    case FETCH_DEFAULT_TEXTS_ERROR:
      return state
        .set('loading', false)
        .set('error', true);

    case STORE_DEFAULT_TEXTS:
      return state
        .set('storing', true)
        .set('error', false);

    case STORE_DEFAULT_TEXTS_SUCCESS:
      return state
        .set('defaultTexts', fromJS(action.payload))
        .set('storing', false)
        .set('error', false);

    case STORE_DEFAULT_TEXTS_ERROR:
      return state
        .set('storing', false)
        .set('error', true);

    case ORDER_DEFAULT_TEXTS:
      defaultTexts = state.get('defaultTexts').toJS();
      delta = action.payload.type === 'up' ? -15 : 15;
      result = defaultTexts.map((item) => ({ ...item, order: (item.order === action.payload.order ? item.order + delta : item.order) }));
      return state
        .set('defaultTexts', fromJS(renumberOrder(sortByOrder(result))));

    case SAVE_DEFAULT_TEXTS_ITEM:
      defaultTexts = state.get('defaultTexts').toJS();
      return state
        .set('defaultTexts', fromJS(defaultTexts.map((item) => ({
          ...item,
          title: item.order === action.payload.order ? action.payload.title : item.title,
          text: item.order === action.payload.order ? action.payload.text : item.text
        }))));

    default:
      return state;
  }
}

export default defaultTextsAdminReducer;
