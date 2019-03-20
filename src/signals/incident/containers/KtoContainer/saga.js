import { put, takeLatest } from 'redux-saga/effects';
// import request from 'utils/request';

// import CONFIGURATION from 'shared/services/configuration/configuration';
import { REQUEST_KTA_ANSWERS } from './constants';
import {
  requestKtaAnswersSuccess, requestKtaAnswersError
} from './actions';

export function* requestKtaAnswers(action) {
  // const requestURL = `${CONFIGURATION.API_ROOT_MLTOOL}signals/v1/public/feedback/standard_answers/`;
  try {
    const isSatisfied = action.payload;
    // const result = yield call(request, requestURL);

    const result = [{
      is_satisfied: true,
      text: 'Mijn melding is snel opgepakt'
    },
    {
      is_satisfied: true,
      text: 'Het probleem is verholpen'
    }, {
      is_satisfied: false,
      text: 'Mijn melding is traag opgepakt'
    },
    {
      is_satisfied: false,
      text: 'Het probleem is niet verholpen'
    }];

    const newResult = {};
    result.forEach((answer) => {
      if (isSatisfied === answer.is_satisfied) {
        newResult[answer.text] = answer.text;
      }
    });

    yield put(requestKtaAnswersSuccess(newResult));
  } catch (error) {
    yield put(requestKtaAnswersError());
  }
}

export default function* watchKtoContainerSaga() {
  yield takeLatest(REQUEST_KTA_ANSWERS, requestKtaAnswers);
}
