import {
  RESET,
  SET_ADDRESS,
  SET_SAVE_BUTTON_LABEL,
  SET_CATEGORIES,
  SET_DATE,
  SET_GROUP_OPTIONS,
  SET_MAIN_CATEGORY,
  SET_NAME,
  SET_NOTE_KEYWORD,
  SET_REFRESH,
} from './constants';

export const reset = () => ({
  type: RESET,
});

export const setAddress = payload => ({
  type: SET_ADDRESS,
  payload,
});

export const setNoteKeyword = payload => ({
  type: SET_NOTE_KEYWORD,
  payload,
});

export const setSaveButtonLabel = payload => ({
  type: SET_SAVE_BUTTON_LABEL,
  payload,
});

export const setCategories = payload => ({
  type: SET_CATEGORIES,
  payload,
});

export const setDate = payload => ({
  type: SET_DATE,
  payload,
});

export const setGroupOptions = payload => ({
  type: SET_GROUP_OPTIONS,
  payload,
});

export const setMainCategory = payload => ({
  type: SET_MAIN_CATEGORY,
  payload,
});

export const setName = payload => ({
  type: SET_NAME,
  payload,
});

export const setRefresh = payload => ({
  type: SET_REFRESH,
  payload,
});
