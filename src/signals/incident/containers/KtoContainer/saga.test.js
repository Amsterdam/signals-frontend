// TEMP
/* eslint-disable */

import { all, call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import request from 'utils/request';

import { authPostCall } from 'shared/services/api/api';
import watchKtoContainerSaga, { requestKtaAnswers, checkKto, storeKto } from './saga';
import { REQUEST_KTA_ANSWERS, CHECK_KTO, STORE_KTO } from './constants';
import {
  requestKtaAnswersSuccess, requestKtaAnswersError,
  checkKtoSuccess, checkKtoError,
  storeKtoSuccess, storeKtoError
} from './actions';

describe.only('KtoContainer saga', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('requestKtaAnswers', () => {
    let payload;
    let gen;
    let answers = {
      results: [
        {is_satisfied: true, text: "Antwoord JA"},
        {is_satisfied: false, text: "Antwoord NEE"}
      ]
    }

    it('should success with JA', () => {
      gen = requestKtaAnswers({ payload: 'ja' });
      expect(gen.next().value).toEqual(call(request, 'https://acc.api.data.amsterdam.nl/signals/v1/public/feedback/standard_answers/'));
      expect(gen.next(answers).value).toEqual(put(requestKtaAnswersSuccess({ 'Antwoord JA': 'Antwoord JA' })));
    });

    it('should success with NEE', () => {
      gen = requestKtaAnswers({ payload: 'nee' });
      expect(gen.next().value).toEqual(call(request, 'https://acc.api.data.amsterdam.nl/signals/v1/public/feedback/standard_answers/'));
      expect(gen.next(answers).value).toEqual(put(requestKtaAnswersSuccess({ 'Antwoord NEE': 'Antwoord NEE' })));
    });

    it('should error', () => {
      gen = requestKtaAnswers({ payload: 'ja' });
      gen.next();
      expect(gen.throw().value).toEqual(put(requestKtaAnswersError()));
    });
  });

  describe('checkKto', () => {
    let payload;
    let gen;

    beforeEach(() => {
      payload = 'abc-42';
      gen = checkKto({ payload });
    });

    it('should success', () => {
      expect(gen.next().value).toEqual(call(request, `https://acc.api.data.amsterdam.nl/signals/v1/public/feedback/forms/${payload}`));
      expect(gen.next().value).toEqual(put(checkKtoSuccess()));
    });

    // it('should error with 404', () => {
      // const error = new Error();
      // error.response = {
        // status: 404
      // }
      // gen.next();
      // expect(gen.next().value).toEqual(put(push('/niet-gevonden')));
      // expect(gen.throw(error).value).toEqual(put(checkKtoError(true)));
    // });

    // it('should error with json body', () => {
    //   const error = new Error();
    //   error.response = {
    //     jsonBody: {
    //       detail: 'too late'
    //     }
    //   }
    //   gen.next();
    //   expect(gen.throw(error).value).toEqual(put(checkKtoError()));
    // });

    // it('should other errors', () => {
    //   gen.next();
    //   expect(gen.throw().value).toEqual(put(checkKtoError()));
    // });
  });

  it('should watchKtoContainerSaga', () => {
    const gen = watchKtoContainerSaga();
    expect(gen.next().value).toEqual(all([
      takeLatest(REQUEST_KTA_ANSWERS, requestKtaAnswers),
      takeLatest(CHECK_KTO, checkKto),
      takeLatest(STORE_KTO, storeKto)
    ]));
  });
});
