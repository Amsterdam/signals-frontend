// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { SET_USER_FILTERS } from './constants';

export const setUserFilters = payload => ({
  type: SET_USER_FILTERS,
  payload,
});
