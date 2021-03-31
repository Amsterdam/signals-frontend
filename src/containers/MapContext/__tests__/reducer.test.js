// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import reducer, { initialState } from '../reducer';
import { SET_LOCATION, SET_ADDRESS, SET_VALUES, SET_LOADING, RESET_LOCATION } from '../constants';

describe('containers/MapContext/reducer', () => {
  const testLocation = {
    lat: 52,
    lon: 4,
  };
  const testAddressText = 'Dam 1, 1001AA, Amsterdam';

  it('should return the state', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
  });

  it('should handle set location', () => {
    const action = {
      type: SET_LOCATION,
      payload: testLocation,
    };

    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      location: action.payload,
    });
  });

  it('should handle set address text', () => {
    const action = {
      type: SET_ADDRESS,
      payload: testAddressText,
    };

    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      addressText: testAddressText,
    });
  });

  it('should handle set values', () => {
    const testValues = {
      location: testLocation,
      addressText: testAddressText,
    };

    const action = {
      type: SET_VALUES,
      payload: testValues,
    };

    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      ...testValues,
    });
  });

  it('should handle set loading', () => {
    const action = {
      type: SET_LOADING,
      payload: true,
    };

    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('should handle reset location', () => {
    const action = {
      type: RESET_LOCATION,
    };

    expect(reducer({ ...initialState, location: {} }, action)).toEqual({
      ...initialState,
    });
  });
});
