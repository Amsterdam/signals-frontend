// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import {
  RESET_LOCATION,
  SET_LOCATION,
  SET_ADDRESS,
  SET_VALUES,
  SET_LOADING,
} from './constants'

export const initialState = {
  address: {
    openbare_ruimte: '',
    huisnummer: '',
    huisletter: '',
    huisnummertoevoeging: '',
    postcode: '',
    woonplaats: '',
  },
  addressText: '',
  coordinates: {
    lat: 0,
    lng: 0,
  },
  loading: false,
}

export default (state, action) => {
  switch (action.type) {
    case RESET_LOCATION:
      return {
        ...state,
        coordinates: initialState.coordinates,
      }

    case SET_LOCATION:
      return {
        ...state,
        coordinates: action.payload,
      }

    case SET_ADDRESS:
      return {
        ...state,
        addressText: action.payload,
      }

    case SET_VALUES:
      return {
        ...state,
        ...action.payload,
      }

    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }

    default:
      return state
  }
}
