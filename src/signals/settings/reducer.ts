// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { SET_USER_FILTERS } from './constants'

import { Actions } from './actions'

export type Filters = {
  profile_department_code?: string
  role?: string
  is_active?: 'true' | 'false'
  username?: string
}

export type State = {
  users: {
    filters: Filters
  }
}

export const initialState = {
  users: {
    filters: {},
  },
}

export default (state: State, action: Actions) => {
  switch (action.type) {
    case SET_USER_FILTERS:
      return {
        ...state,
        users: {
          ...state.users,
          filters: { ...state.users.filters, ...action.payload },
        },
      }

    default:
      return state
  }
}
