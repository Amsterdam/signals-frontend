// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { SET_USER_FILTERS } from './constants'

import type { Filters } from './reducer'

type SetUserFiltersAction = {
  type: typeof SET_USER_FILTERS
  payload: Filters
}

export type Actions = SetUserFiltersAction

export const setUserFilters = (payload: Filters): SetUserFiltersAction => ({
  type: SET_USER_FILTERS,
  payload,
})
