import {
  resetLocationAction,
  setLocationAction,
  setAddressAction,
  setValuesAction,
  setLoadingAction,
} from '../actions';
import { RESET_LOCATION, SET_LOCATION, SET_ADDRESS, SET_VALUES, SET_LOADING } from '../constants';

describe('containers/MapContext/actions', () => {
  test('setLocationAction', () => {
    const payload = {
      some: 'object',
    };

    expect(setLocationAction(payload)).toEqual({
      type: SET_LOCATION,
      payload,
    });
  });

  test('resetLocationAction', () => {
    expect(resetLocationAction()).toEqual({
      type: RESET_LOCATION,
    });
  });

  test('setAddressAction', () => {
    const payload = {
      some: 'object',
    };

    expect(setAddressAction(payload)).toEqual({
      type: SET_ADDRESS,
      payload,
    });
  });

  test('setValuesAction', () => {
    const payload = {
      some: 'object',
    };

    expect(setValuesAction(payload)).toEqual({
      type: SET_VALUES,
      payload,
    });
  });

  test('setLoadingAction', () => {
    const payload = {
      some: 'object',
    };

    expect(setLoadingAction(payload)).toEqual({
      type: SET_LOADING,
      payload,
    });
  });
});
