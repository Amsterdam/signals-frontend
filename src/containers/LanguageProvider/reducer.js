import produce from 'immer';
import { CHANGE_LOCALE } from './constants';
import { DEFAULT_LOCALE } from '../App/constants';

export const initialState = {
  locale: DEFAULT_LOCALE,
};

/* eslint-disable default-case, no-param-reassign */
export default (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_LOCALE:
        draft.locale = action.locale;
        break;
    }
  });
