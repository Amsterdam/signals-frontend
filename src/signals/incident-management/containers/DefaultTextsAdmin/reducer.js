import produce from 'immer';

import { defaultTextsOptionList } from 'signals/incident-management/definitions/statusList';

import {
  FETCH_DEFAULT_TEXTS,
  FETCH_DEFAULT_TEXTS_SUCCESS,
  FETCH_DEFAULT_TEXTS_ERROR,
  STORE_DEFAULT_TEXTS,
  STORE_DEFAULT_TEXTS_SUCCESS,
  STORE_DEFAULT_TEXTS_ERROR,
  ORDER_DEFAULT_TEXTS,
  SAVE_DEFAULT_TEXTS_ITEM,
} from './constants';

export const initialState = {
  defaultTexts: [],
  loading: false,
  error: false,
  storing: false,
  defaultTextsOptionList,
};

/* eslint-disable default-case, no-param-reassign */
export default (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case FETCH_DEFAULT_TEXTS:
        draft.categoryUrl = action.payload.category_url;
        draft.state = action.payload.state;
        draft.loading = true;
        draft.error = false;
        break;

      case FETCH_DEFAULT_TEXTS_SUCCESS:
        draft.defaultTexts = action.payload;
        draft.loading = false;
        draft.error = false;
        break;

      case FETCH_DEFAULT_TEXTS_ERROR:
        draft.loading = false;
        draft.error = true;
        break;

      case STORE_DEFAULT_TEXTS:
        draft.storing = true;
        draft.error = false;
        break;

      case STORE_DEFAULT_TEXTS_SUCCESS:
        draft.defaultTexts = action.payload;
        draft.storing = false;
        draft.error = false;
        break;

      case STORE_DEFAULT_TEXTS_ERROR:
        draft.storing = false;
        draft.error = true;
        break;

      case ORDER_DEFAULT_TEXTS:
        // eslint-disable-next-line
        const delta = action.payload.type === 'up' ? -1 : 1;

        draft.defaultTexts = [
          ...state.defaultTexts.splice(
            action.payload.index + delta,
            0,
            state.defaultTexts.splice(action.payload.index, 1)[0],
          ),
        ];
        break;

      case SAVE_DEFAULT_TEXTS_ITEM:
        // eslint-disable-next-line
        const { defaultTexts } = Object.assign({}, state);

        if (action.payload.data.title || action.payload.data.text) {
          defaultTexts[action.payload.index] = action.payload.data;
        } else {
          defaultTexts.splice(action.payload.index, 1);
        }

        draft.defaultTexts = [...defaultTexts];

        break;
    }
  });
