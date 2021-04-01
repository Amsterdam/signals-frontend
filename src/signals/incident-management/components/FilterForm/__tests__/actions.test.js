// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import categories from 'utils/__tests__/fixtures/categories.json';

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
} from '../constants';

import {
  reset,
  setAddress,
  setSaveButtonLabel,
  setCategories,
  setDate,
  setGroupOptions,
  setMainCategory,
  setName,
  setNoteKeyword,
  setRefresh,
} from '../actions';

describe('signals/incident-management/components/FilterForm/actions', () => {
  it('should create an action to reset the state', () => {
    const expectedAction = {
      type: RESET,
    };

    expect(reset()).toEqual(expectedAction);
  });

  it('should create an action to set the address', () => {
    const address = 'Weesperstraat 113';
    const expectedAction = {
      type: SET_ADDRESS,
      payload: address,
    };

    expect(setAddress(address)).toEqual(expectedAction);
  });

  it('should create an action to set the note keyword', () => {
    const noteKeyword = 'test123';
    const expectedAction = {
      type: SET_NOTE_KEYWORD,
      payload: noteKeyword,
    };

    expect(setNoteKeyword(noteKeyword)).toEqual(expectedAction);
  });

  it('should create an action to set the save button label', () => {
    const shouldSet = true;
    const expectedAction = {
      type: SET_SAVE_BUTTON_LABEL,
      payload: shouldSet,
    };

    expect(setSaveButtonLabel(shouldSet)).toEqual(expectedAction);
  });

  it('should create an action to set categories', () => {
    const cats = categories.sub;
    const expectedAction = {
      type: SET_CATEGORIES,
      payload: cats,
    };

    expect(setCategories(cats)).toEqual(expectedAction);
  });

  it('should create an action to set a date field', () => {
    const date = { created_before: '2020-01-30' };
    const expectedAction = {
      type: SET_DATE,
      payload: date,
    };

    expect(setDate(date)).toEqual(expectedAction);
  });

  it('should create an action to set group options', () => {
    const options = categories.mainToSub.afval;
    const expectedAction = {
      type: SET_GROUP_OPTIONS,
      payload: options,
    };

    expect(setGroupOptions(options)).toEqual(expectedAction);
  });

  it('should create an action to set a main category', () => {
    const mainCategory = categories.main[0];
    const expectedAction = {
      type: SET_MAIN_CATEGORY,
      payload: mainCategory,
    };

    expect(setMainCategory(mainCategory)).toEqual(expectedAction);
  });

  it('should create an action to set the name', () => {
    const name = 'This is my filter name';
    const expectedAction = {
      type: SET_NAME,
      payload: name,
    };

    expect(setName(name)).toEqual(expectedAction);
  });

  it('should create an action to set refresh', () => {
    const refresh = true;
    const expectedAction = {
      type: SET_REFRESH,
      payload: refresh,
    };

    expect(setRefresh(refresh)).toEqual(expectedAction);
  });
});
