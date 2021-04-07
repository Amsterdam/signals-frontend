// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import {
  FETCH_CATEGORIES_FAILED,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES,
} from './constants';

export const fetchCategories = () => ({
  type: FETCH_CATEGORIES,
});

export const fetchCategoriesSuccess = payload => ({
  type: FETCH_CATEGORIES_SUCCESS,
  payload,
});

export const fetchCategoriesFailed = payload => ({
  type: FETCH_CATEGORIES_FAILED,
  payload,
});
