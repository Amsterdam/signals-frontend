import React, { useReducer, memo } from 'react';
import PropTypes from 'prop-types';
import MapContext from './context';
import reducer, { initialState } from './reducer';

const MapContainer = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MapContext.Provider value={{ state, dispatch }}>
      {children}
    </MapContext.Provider>
  );
};

MapContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default memo(MapContainer);
