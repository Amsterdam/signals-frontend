// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { call, put, takeLatest } from 'redux-saga/effects'

import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import { authCall, getErrorMessage } from 'shared/services/api/api'
import CONFIGURATION from 'shared/services/configuration/configuration'
import type Categories from 'types/api/categories'

import { fetchCategoriesSuccess, fetchCategoriesFailed } from './actions'
import { FETCH_CATEGORIES } from './constants'

export function* fetchCategories() {
  const requestURL = CONFIGURATION.CATEGORIES_PRIVATE_ENDPOINT

  try {
    const categories: Categories = yield call(
      authCall,
      `${requestURL}?page_size=1000`
    )

    yield put(fetchCategoriesSuccess(categories))
  } catch (error) {
    yield put(fetchCategoriesFailed(error as Error))

    yield put(
      showGlobalNotification({
        title: getErrorMessage(error),
        message: 'Het categorieën overzicht kon niet opgehaald worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    )
  }
}

export default function* watchCategoriesSaga() {
  yield takeLatest(FETCH_CATEGORIES, fetchCategories)
}
