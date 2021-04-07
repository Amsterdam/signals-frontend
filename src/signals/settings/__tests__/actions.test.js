// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { setUserFilters } from '../actions';
import { SET_USER_FILTERS } from '../constants';

describe('signals/settings/actions', () => {
  test('setUserFilters', () => {
    const payload = {
      some: 'object',
    };

    expect(setUserFilters(payload)).toEqual({
      type: SET_USER_FILTERS,
      payload,
    });
  });
});
