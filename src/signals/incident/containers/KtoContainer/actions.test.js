import { testActionCreator } from 'test/utils';

import {
  updateKto,
  requestKtaAnswers, requestKtaAnswersSuccess, requestKtaAnswersError,
  checkKto, checkKtoSuccess, checkKtoError,
  storeKto, storeKtoSuccess, storeKtoError
} from './actions';
import {
  UPDATE_KTA,
  REQUEST_KTA_ANSWERS, REQUEST_KTA_ANSWERS_SUCCESS, REQUEST_KTA_ANSWERS_ERROR,
  CHECK_KTO, CHECK_KTO_SUCCESS, CHECK_KTO_ERROR,
  STORE_KTO, STORE_KTO_SUCCESS, STORE_KTO_ERROR
} from './constants';

describe('KtoContainer actions', () => {
  const payload = {
    text: 'foo',
    category: 'bar'
  };

  it('should dispatch updateKto action', () => {
    testActionCreator(updateKto, UPDATE_KTA, payload);
  });

  it('should dispatch requestKtaAnswers action', () => {
    testActionCreator(requestKtaAnswers, REQUEST_KTA_ANSWERS, payload);
  });

  it('should dispatch requestKtaAnswersSuccess action', () => {
    testActionCreator(requestKtaAnswersSuccess, REQUEST_KTA_ANSWERS_SUCCESS, payload);
  });

  it('should dispatch requestKtaAnswersError action', () => {
    testActionCreator(requestKtaAnswersError, REQUEST_KTA_ANSWERS_ERROR);
  });

  it('should dispatch checkKto action', () => {
    testActionCreator(checkKto, CHECK_KTO, payload);
  });

  it('should dispatch checkKtoSuccess action', () => {
    testActionCreator(checkKtoSuccess, CHECK_KTO_SUCCESS, payload);
  });

  it('should dispatch checkKtoError action', () => {
    testActionCreator(checkKtoError, CHECK_KTO_ERROR, payload);
  });

  it('should dispatch storeKto action', () => {
    testActionCreator(storeKto, STORE_KTO, payload);
  });

  it('should dispatch storeKtoSuccess action', () => {
    testActionCreator(storeKtoSuccess, STORE_KTO_SUCCESS);
  });

  it('should dispatch storeKtoError action', () => {
    testActionCreator(storeKtoError, STORE_KTO_ERROR, payload);
  });
});
