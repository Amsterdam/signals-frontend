import { RESET_LOCATION, SET_LOCATION, SET_ADDRESS, SET_VALUES } from './constants';

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
  location: {
    lat: 0,
    lng: 0,
  },
};

export default (state, action) => {
  switch (action.type) {
    case RESET_LOCATION:
      return {
        ...state,
        location: initialState.location,
      };

    case SET_LOCATION:
      return {
        ...state,
        location: action.payload,
      };

    case SET_ADDRESS:
      return {
        ...state,
        addressText: action.payload,
      };

    case SET_VALUES:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
