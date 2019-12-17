import { all, call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router/immutable';
import request from 'utils/request';

import CONFIGURATION from 'shared/services/configuration/configuration';
import watchKtoContainerSaga, {
  requestKtoAnswers,
  checkKto,
  storeKto,
} from './saga';
import { REQUEST_KTO_ANSWERS, CHECK_KTO, STORE_KTO } from './constants';
import {
  requestKtoAnswersSuccess,
  requestKtoAnswersError,
  checkKtoSuccess,
  checkKtoError,
  storeKtoSuccess,
  storeKtoError,
} from './actions';

describe('KtoContainer saga', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('requestKtoAnswers', () => {
    let gen;
    const answers = {
      results: [
        { is_satisfied: true, text: 'Antwoord JA' },
        { is_satisfied: false, text: 'Antwoord NEE' },
      ],
    };

    it('should success with JA', () => {
      gen = requestKtoAnswers({ payload: true });
      expect(gen.next().value).toEqual(
        call(request, CONFIGURATION.FEEDBACK_STANDARD_ANSWERS_ENDPOINT)
      );
      expect(gen.next(answers).value).toEqual(
        put(requestKtoAnswersSuccess({ 'Antwoord JA': 'Antwoord JA' }))
      );
    });

    it('should success with NEE', () => {
      gen = requestKtoAnswers({ payload: false });
      expect(gen.next().value).toEqual(
        call(request, CONFIGURATION.FEEDBACK_STANDARD_ANSWERS_ENDPOINT)
      );
      expect(gen.next(answers).value).toEqual(
        put(requestKtoAnswersSuccess({ 'Antwoord NEE': 'Antwoord NEE' }))
      );
    });

    it('should error', () => {
      gen = requestKtoAnswers({ payload: 'ja' });
      gen.next();
      expect(gen.throw().value).toEqual(put(requestKtoAnswersError()));
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
      expect(gen.next().value).toEqual(
        call(request, `${CONFIGURATION.FEEDBACK_FORMS_ENDPOINT}${payload}`)
      );
      expect(gen.next().value).toEqual(put(checkKtoSuccess()));
    });

    it('should error with 404', () => {
      const error = new Error();
      error.response = {
        status: 404,
      };
      gen.next();
      expect(gen.throw(error).value).toEqual(put(push('/niet-gevonden')));
      expect(gen.next().value).toEqual(put(checkKtoError(true)));
    });

    it('should error with json body', () => {
      const error = new Error();
      error.response = {
        jsonBody: {
          detail: 'too late',
        },
      };
      gen.next();
      expect(gen.throw(error).value).toEqual(put(checkKtoError('too late')));
    });

    it('should error with other errors', () => {
      gen.next();
      expect(gen.throw().value).toEqual(put(checkKtoError(true)));
    });
  });

  describe('storeKto', () => {
    let payload;
    let gen;

    beforeEach(() => {
      payload = {
        uuid: 'abc-42',
        form: {
          is_satisfied: true,
          text: 'foo',
          text_extra: 'bar',
          allows_contact: false,
        },
      };
      gen = storeKto({ payload });
    });

    it('should success', () => {
      expect(gen.next().value).toEqual(
        call(
          request,
          `${CONFIGURATION.FEEDBACK_FORMS_ENDPOINT}${payload.uuid}`,
          {
            method: 'PUT',
            body: JSON.stringify(payload.form),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      );
      expect(gen.next().value).toEqual(put(storeKtoSuccess()));
    });

    it('should error with other errors', () => {
      gen.next();
      expect(gen.throw().value).toEqual(put(storeKtoError()));
    });
  });

  it('should watchKtoContainerSaga', () => {
    const gen = watchKtoContainerSaga();
    expect(gen.next().value).toEqual(
      all([
        takeLatest(REQUEST_KTO_ANSWERS, requestKtoAnswers),
        takeLatest(CHECK_KTO, checkKto),
        takeLatest(STORE_KTO, storeKto),
      ])
    );
  });
});
