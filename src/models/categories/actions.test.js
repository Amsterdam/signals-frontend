// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import categoriesJson from 'utils/__tests__/fixtures/categories_private.json';

import * as actions from './actions';
import * as constants from './constants';

describe('models/categories/actions', () => {
  test('fetchCategories', () => {
    expect(actions.fetchCategories()).toEqual({
      type: constants.FETCH_CATEGORIES,
    });
  });

  test('fetchCategoriesSuccess', () => {
    const payload = categoriesJson;
    expect(actions.fetchCategoriesSuccess(payload)).toEqual({
      type: constants.FETCH_CATEGORIES_SUCCESS,
      payload,
    });
  });

  test('fetchCategoriesFailed', () => {
    const payload = new Error('Wrong!!!1!');

    expect(actions.fetchCategoriesFailed(payload)).toEqual({
      type: constants.FETCH_CATEGORIES_FAILED,
      payload,
    });
  });
});
