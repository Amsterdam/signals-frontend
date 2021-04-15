// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { SET_CAN_VIEW, SET_IS_RESPONSIBLE } from './constants';

export const setCanView = payload => ({
  type: SET_CAN_VIEW,
  payload,
});

export const setIsResponsible = payload => ({
  type: SET_IS_RESPONSIBLE,
  payload,
});
