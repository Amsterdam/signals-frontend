// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type Categories from 'types/api/categories'

import {
  FETCH_CATEGORIES_FAILED,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES,
} from './constants'

type FetchCategoriesAction = {
  type: typeof FETCH_CATEGORIES
}

export type FetchCategoriesSuccessAction = {
  type: typeof FETCH_CATEGORIES_SUCCESS
  payload: Categories
}

export type FetchCategoriesFailedAction = {
  type: typeof FETCH_CATEGORIES_FAILED
  payload: Error
}

export type CategoryActions =
  | FetchCategoriesAction
  | FetchCategoriesSuccessAction
  | FetchCategoriesFailedAction

export const fetchCategories = (): FetchCategoriesAction => ({
  type: FETCH_CATEGORIES,
})

export const fetchCategoriesSuccess = (
  payload: Categories
): FetchCategoriesSuccessAction => ({
  type: FETCH_CATEGORIES_SUCCESS,
  payload,
})

export const fetchCategoriesFailed = (
  payload: Error
): FetchCategoriesFailedAction => ({
  type: FETCH_CATEGORIES_FAILED,
  payload,
})
