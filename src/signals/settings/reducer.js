// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { SET_USER_FILTERS } from './constants';

export const initialState = {
  users: {
    filters: {},
  },
};

export default (state, action) => {
  switch (action.type) {
    case SET_USER_FILTERS:
      return {
        ...state,
        users: {
          ...state.users,
          filters: { ...state.users.filters, ...action.payload },
        },
      };

    default:
      return state;
  }
};
