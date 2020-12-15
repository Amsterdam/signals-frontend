import * as Sentry from '@sentry/browser';
import { authCall, getErrorMessage } from 'shared/services/api/api';
import { testSaga } from 'redux-saga-test-plan';

import * as actions from 'containers/App/actions';
import categoriesJson from 'utils/__tests__/fixtures/categories_private.json';
import CONFIGURATION from 'shared/services/configuration/configuration';
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';

import { fetchCategoriesSuccess, fetchCategoriesFailed } from './actions';
import watchCategoriesSaga, { fetchCategories } from './saga';
import { FETCH_CATEGORIES } from './constants';

jest.mock('@sentry/browser');

describe('models/categories/saga', () => {
  it('should watchCategoriesSaga', () => {
    testSaga(watchCategoriesSaga)
      .next()
      .takeLatest(FETCH_CATEGORIES, fetchCategories)
      .next()
      .isDone();
  });

  describe('fetchCategories', () => {
    const requestUrl = CONFIGURATION.CATEGORIES_PRIVATE_ENDPOINT;

    it('should call endpoint and dispatch success', () => {
      testSaga(fetchCategories)
        .next()
        .call(authCall, `${requestUrl}?page_size=1000`)
        .next(categoriesJson)
        .put(fetchCategoriesSuccess(categoriesJson))
        .next()
        .isDone();
    });

    it('should dispatch error', () => {
      const message = '404 not found';
      const error = new Error(message);

      testSaga(fetchCategories)
        .next()
        .call(authCall, `${requestUrl}?page_size=1000`)
        .throw(error)
        .put(fetchCategoriesFailed(error))
        .next()
        .put(
          actions.showGlobalNotification({
            title: getErrorMessage(error),
            message: 'Het categorieën overzicht kon niet opgehaald worden',
            variant: VARIANT_ERROR,
            type: TYPE_LOCAL,
          })
        )
        .next()
        .call([Sentry, 'captureException'], error)
        .next()
        .isDone();
    });
  });
});
