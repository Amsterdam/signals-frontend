import {} from 'immutable';
import ktoContainerReducer, { initialState } from './reducer';

import {
  UPDATE_KTO,
  REQUEST_KTO_ANSWERS,
  REQUEST_KTO_ANSWERS_SUCCESS,
  REQUEST_KTO_ANSWERS_ERROR,
  CHECK_KTO,
  CHECK_KTO_SUCCESS,
  CHECK_KTO_ERROR,
  STORE_KTO,
  STORE_KTO_SUCCESS,
  STORE_KTO_ERROR,
} from './constants';

describe('ktoContainerReducer', () => {
  it('returns the initial state', () => {
    expect(ktoContainerReducer(undefined, {})).toEqual(initialState);
  });

  it('should UPDATE_KTO', () => {
    expect(
      ktoContainerReducer(
        {
          form: {
            so: 'long',
          },
        },
        {
          type: UPDATE_KTO,
          payload: {
            thanks: 'for all the fish',
          },
        },
      ),
    ).toEqual({
      form: {
        so: 'long',
        thanks: 'for all the fish',
      },
    });
  });

  it('should REQUEST_KTO_ANSWERS', () => {
    const payload = true;
    expect(
      ktoContainerReducer(undefined, {
        type: REQUEST_KTO_ANSWERS,
        payload,
      }),
    ).toEqual({
      ...initialState,
      form: {
        is_satisfied: payload,
      },
    });
  });

  it('should REQUEST_KTO_ANSWERS_SUCCESS', () => {
    const payload = {
      'answer 1': 'answer 1',
      'answer 2': 'answer 2',
    };
    expect(
      ktoContainerReducer(undefined, {
        type: REQUEST_KTO_ANSWERS_SUCCESS,
        payload,
      }),
    ).toEqual({
      ...initialState,
      answers: payload,
    });
  });

  it('should REQUEST_KTO_ANSWERS_ERROR', () => {
    expect(
      ktoContainerReducer(undefined, {
        type: REQUEST_KTO_ANSWERS_ERROR,
      }),
    ).toEqual({
      ...initialState,
      error: true,
    });
  });

  it('should CHECK_KTO', () => {
    const payload = 'gasjfdfbz-2567zascvn-aaa';
    expect(
      ktoContainerReducer(undefined, {
        type: CHECK_KTO,
        payload,
      }),
    ).toEqual({
      ...initialState,
      uuid: payload,
      statusError: null,
    });
  });

  it('should CHECK_KTO_SUCCESS', () => {
    expect(
      ktoContainerReducer(undefined, {
        type: CHECK_KTO_SUCCESS,
      }),
    ).toEqual({
      ...initialState,
      statusError: null,
    });
  });

  it('should CHECK_KTO_ERROR', () => {
    const payload = 'filled out';
    expect(
      ktoContainerReducer(undefined, {
        type: CHECK_KTO_ERROR,
        payload,
      }),
    ).toEqual({
      ...initialState,
      statusError: payload,
    });
  });

  it('should STORE_KTO', () => {
    expect(
      ktoContainerReducer(undefined, {
        type: STORE_KTO,
      }),
    ).toEqual({
      ...initialState,
      ktoError: false,
      ktoFinished: false,
    });
  });

  it('should STORE_KTO_SUCCESS', () => {
    expect(
      ktoContainerReducer(undefined, {
        type: STORE_KTO_SUCCESS,
      }),
    ).toEqual({
      ...initialState,
      ktoError: false,
      ktoFinished: true,
    });
  });

  it('should STORE_KTO_ERROR', () => {
    expect(
      ktoContainerReducer(undefined, {
        type: STORE_KTO_ERROR,
      }),
    ).toEqual({
      ...initialState,
      ktoError: true,
      ktoFinished: false,
    });
  });
});
