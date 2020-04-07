import { SET_LOCATION, SET_ADDRESS, SET_VALUES } from './constants';

export const initialState = {
  location: {
    lat: 0,
    lng: 0,
  },
  addressText: '',
};

export default (state, action) => {
  switch (action.type) {
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
