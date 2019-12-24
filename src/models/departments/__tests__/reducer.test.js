import { fromJS } from 'immutable';
import departmentsJson from 'utils/__tests__/fixtures/departments.json';

import reducer, { initialState } from '../reducer';
import * as constants from '../constants';

const intermediateState = fromJS({
  count: 9,
  error: false,
  list: departmentsJson.results.slice(0, 9),
  loading: false,
});

describe('models/departments/reducer', () => {
  test('default', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  test('FETCH_DEPARTMENTS', () => {
    const action = { type: constants.FETCH_DEPARTMENTS };

    const result = initialState.set('loading', true);

    expect(reducer(initialState, action)).toEqual(result);
    expect(reducer(intermediateState, action)).toEqual(result);
  });

  test('FETCH_DEPARTMENTS_SUCCESS', () => {
    const type = constants.FETCH_DEPARTMENTS_SUCCESS;
    const action = { type, payload: departmentsJson };

    const result = fromJS({
      count: departmentsJson.count,
      error: false,
      errorMessage: '',
      list: departmentsJson.results,
      loading: false,
    });

    expect(reducer(initialState, action)).toEqual(result);
    expect(reducer(intermediateState, action)).toEqual(result);
  });

  test('FETCH_DEPARTMENTS_ERROR', () => {
    const type = constants.FETCH_DEPARTMENTS_ERROR;
    const errorMessage = 'Wrong!!!1!';
    const payload = errorMessage;
    const action = { type, payload };

    const result = fromJS({
      count: undefined,
      error: true,
      errorMessage,
      list: [],
      loading: false,
    });

    expect(reducer(initialState, action)).toEqual(result);
    expect(reducer(intermediateState, action)).toEqual(
      result.set('list', intermediateState.get('list'))
    );
  });
});
