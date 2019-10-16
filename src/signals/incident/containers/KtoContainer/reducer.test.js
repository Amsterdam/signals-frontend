import { fromJS } from 'immutable';
import ktoContainerReducer, { initialState } from './reducer';

import {
  UPDATE_KTO,
  REQUEST_KTO_ANSWERS, REQUEST_KTO_ANSWERS_SUCCESS, REQUEST_KTO_ANSWERS_ERROR,
  CHECK_KTO, CHECK_KTO_SUCCESS, CHECK_KTO_ERROR,
  STORE_KTO, STORE_KTO_SUCCESS, STORE_KTO_ERROR,
} from './constants';

describe('ktoContainerReducer', () => {
  it('returns the initial state', () => {
    expect(ktoContainerReducer(undefined, {})).toEqual(fromJS(initialState));
  });

  it('should UPDATE_KTO', () => {
    expect(
      ktoContainerReducer(fromJS({
        form: {
          so: 'long',
        },
      }), {
        type: UPDATE_KTO,
        payload: {
          thanks: 'for all the fish',
        },
      }).toJS()
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
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
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
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      answers: payload,
    });
  });

  it('should REQUEST_KTO_ANSWERS_ERROR', () => {
    expect(
      ktoContainerReducer(undefined, {
        type: REQUEST_KTO_ANSWERS_ERROR,
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      error: true,
    });
  });

  it('should CHECK_KTO', () => {
    const payload = 'gasjfdfbz-2567zascvn-aaa';
    expect(
      ktoContainerReducer(undefined, {
        type: CHECK_KTO,
        payload,
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      uuid: payload,
      statusError: null,
    });
  });

  it('should CHECK_KTO_SUCCESS', () => {
    expect(
      ktoContainerReducer(undefined, {
        type: CHECK_KTO_SUCCESS,
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      statusError: null,
    });
  });

  it('should CHECK_KTO_ERROR', () => {
    const payload = 'filled out';
    expect(
      ktoContainerReducer(undefined, {
        type: CHECK_KTO_ERROR,
        payload,
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      statusError: payload,
    });
  });

  it('should STORE_KTO', () => {
    expect(
      ktoContainerReducer(undefined, {
        type: STORE_KTO,
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      ktoError: false,
      ktoFinished: false,
    });
  });

  it('should STORE_KTO_SUCCESS', () => {
    expect(
      ktoContainerReducer(undefined, {
        type: STORE_KTO_SUCCESS,
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      ktoError: false,
      ktoFinished: true,
    });
  });

  it('should STORE_KTO_ERROR', () => {
    expect(
      ktoContainerReducer(undefined, {
        type: STORE_KTO_ERROR,
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      ktoError: true,
      ktoFinished: false,
    });
  });
});
