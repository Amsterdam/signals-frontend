// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { call, put, takeLatest } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { authCall, getErrorMessage } from 'shared/services/api/api';
import { showGlobalNotification } from 'containers/App/actions';
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';

import { FETCH_CATEGORIES } from './constants';
import { fetchCategoriesSuccess, fetchCategoriesFailed } from './actions';

export function* fetchCategories() {
  const requestURL = CONFIGURATION.CATEGORIES_PRIVATE_ENDPOINT;

  try {
    const categories = yield call(authCall, `${requestURL}?page_size=1000`);

    yield put(fetchCategoriesSuccess(categories));
  } catch (error) {
    yield put(fetchCategoriesFailed(error));

    yield put(
      showGlobalNotification({
        title: getErrorMessage(error),
        message: 'Het categorieën overzicht kon niet opgehaald worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    );

    yield call([Sentry, 'captureException'], error);
  }
}

export default function* watchCategoriesSaga() {
  yield takeLatest(FETCH_CATEGORIES, fetchCategories);
}
