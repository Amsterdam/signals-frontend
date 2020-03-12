import React, { useReducer, useContext } from 'react';

import { initialState } from './ducks';

export const GeocoderContext = React.createContext(initialState);
export const useGeocoderContext = () => useContext(GeocoderContext);

