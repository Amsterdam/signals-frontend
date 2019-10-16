import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import { push } from 'react-router-redux';
import request from 'utils/request';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { REQUEST_KTO_ANSWERS, CHECK_KTO, STORE_KTO } from './constants';
import {
  requestKtoAnswersSuccess, requestKtoAnswersError,
  checkKtoSuccess, checkKtoError,
  storeKtoSuccess, storeKtoError,
} from './actions';

export function* requestKtoAnswers(action) {
  const requestURL = `${CONFIGURATION.API_ROOT_MLTOOL}signals/v1/public/feedback/standard_answers/`;
  try {
    const is_satisfied = action.payload;
    const result = yield call(request, requestURL);
    const answers = {};
    result.results.forEach(answer => {
      if (is_satisfied === answer.is_satisfied) {
        answers[answer.text] = answer.text;
      }
    });
    yield put(requestKtoAnswersSuccess(answers));
  } catch (error) {
    yield put(requestKtoAnswersError());
  }
}

export function* checkKto(action) {
  const requestURL = `${CONFIGURATION.API_ROOT_MLTOOL}signals/v1/public/feedback/forms`;

  try {
    const uuid = action.payload;
    yield call(request, `${requestURL}/${uuid}`);
    yield put(checkKtoSuccess());
  } catch (error) {
    if (error && error.response && error.response.status === 404) {
      yield put(push('/niet-gevonden'));
    }
    const message = error && error.response && error.response.jsonBody && error.response.jsonBody.detail;
    yield put(checkKtoError(message || true));
  }
}

export function* storeKto(action) {
  const requestURL = `${CONFIGURATION.API_ROOT_MLTOOL}signals/v1/public/feedback/forms`;
  try {
    const payload = action.payload;
    yield call(request, `${requestURL}/${payload.uuid}`, {
      method: 'PUT',
      body: JSON.stringify(action.payload.form),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    yield put(storeKtoSuccess());
  } catch (error) {
    yield put(storeKtoError(error));
  }
}

export default function* watchKtoContainerSaga() {
  yield all([
    takeLatest(REQUEST_KTO_ANSWERS, requestKtoAnswers),
    takeLatest(CHECK_KTO, checkKto),
    takeLatest(STORE_KTO, storeKto),
  ]);
}
