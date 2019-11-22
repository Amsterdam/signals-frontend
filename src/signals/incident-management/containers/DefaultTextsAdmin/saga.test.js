import { testSaga } from 'redux-saga-test-plan';
import { takeLatest } from 'redux-saga/effects';
import { authCall, authPostCall } from 'shared/services/api/api';

import watchDefaultTextsAdminSaga,
{
  fetchDefaultTexts,
  storeDefaultTexts,
} from './saga'
import {
  FETCH_DEFAULT_TEXTS,
  STORE_DEFAULT_TEXTS,
} from './constants';

import {
  fetchDefaultTextsSuccess,
  fetchDefaultTextsError,
  storeDefaultTextsSuccess,
  storeDefaultTextsError,
} from './actions';

describe('/signals/incident-management/containers/DefaultTextsAdmin/saga', () => {
  const requestURL = 'https://acc.api.data.amsterdam.nl/signals/v1/private/terms/categories/afval/sub_categories/asbest-accu/status-message-templates';
  const category_url = 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu';
  const payload = {
    main_slug: 'afval',
    sub_slug: 'asbest-accu',
    state: 'm',
    category_url,
  };
  const action = { payload };

  it('should watch watchDefaultTextsAdminSaga', () => {
    testSaga(watchDefaultTextsAdminSaga)
      .next()
      .all([
        takeLatest(FETCH_DEFAULT_TEXTS, fetchDefaultTexts),
        takeLatest(STORE_DEFAULT_TEXTS, storeDefaultTexts),
      ])
      .next()
      .isDone();
  });

  describe('fetchDefaultTexts', () => {
    it('should dispatch success', () => {
      const result = [{
        state: 'm',
        templates: [{ title: 'gemend', text: 'foo' }],
      },{
        state: 'i',
        templates: [{ title: 'in behandeling', text: 'bar' }],
      }];

      testSaga(fetchDefaultTexts, action)
        .next()
        .call(authCall, requestURL)
        .next(result)
        .put(fetchDefaultTextsSuccess(result[0].templates))
        .next()
        .isDone();
    });

    it('should dispatch success empty list with missing template', () => {
      const result = [{
        state: 'm',
      },{
        state: 'i',
      }];

      testSaga(fetchDefaultTexts, action)
        .next()
        .call(authCall, requestURL)
        .next(result)
        .put(fetchDefaultTextsSuccess([]))
        .next()
        .isDone();
    });

    it('should dispatch error', () => {
      const error = new Error('Something bad happened');
      error.response = {
        status: 500,
      };

      testSaga(fetchDefaultTexts, action)
        .next()
        .throw(error)
        .put(fetchDefaultTextsError('Internal server error'))
        .next()
        .isDone();
    });
  });

  describe('storeDefaultTexts', () => {
    action.payload.post = {
      state: 'i',
      templates: [{ title: 'nieuwed', text: 'text' }],
    };

    it('should dispatch success', () => {
      const result = [{
        state: 'm',
        templates: [{ title: 'gemend', text: 'foo' }],
      },{
        state: 'i',
        templates: [{ title: 'in behandeling', text: 'bar' }],
      }];

      testSaga(storeDefaultTexts, action)
        .next()
        .call(authPostCall, requestURL, [payload.post])
        .next(result)
        .put(storeDefaultTextsSuccess(result[1].templates))
        .next()
        .isDone();
    });

    it('should dispatch success empty list with missing template', () => {
      const result = [{
        state: 'm'      },{
        state: 'i',
      }];

      testSaga(storeDefaultTexts, action)
        .next()
        .call(authPostCall, requestURL, [payload.post])
        .next(result)
        .put(storeDefaultTextsSuccess([]))
        .next()
        .isDone();
    });

    it('should dispatch error', () => {
      const error = new Error('Something bad happened');
      error.response = {
        status: 500,
      };

      testSaga(storeDefaultTexts, action)
        .next()
        .throw(error)
        .put(storeDefaultTextsError('Internal server error'))
        .next()
        .isDone();
    });
  });
});
