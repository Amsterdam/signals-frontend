import { fromJS } from 'immutable';

import { defaultTextsOptionList } from 'signals/incident-management/definitions/statusList';

import {
  FETCH_DEFAULT_TEXTS, FETCH_DEFAULT_TEXTS_SUCCESS, FETCH_DEFAULT_TEXTS_ERROR,
  STORE_DEFAULT_TEXTS, STORE_DEFAULT_TEXTS_SUCCESS, STORE_DEFAULT_TEXTS_ERROR,
  ORDER_DEFAULT_TEXTS
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
      const defaultTexts = state.get('defaultTexts').toJS();
      const delta = action.payload.type === 'up' ? -15 : 15;
      const result = defaultTexts.map((item) => ({ ...item, order: (item.order === action.payload.order ? item.order + delta : item.order) }));
      return state
        .set('defaultTexts', fromJS(renumberOrder(sortByOrder(result))));

    default:
      return state;
  }
}

export default defaultTextsAdminReducer;
