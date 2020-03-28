import React, { useReducer, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import MapContext from './context';
import reducer, { initialState, mapValuesType } from './reducer';
import { setValuesAction } from './actions';

const MapContainer = ({ value, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch(setValuesAction(value));
  }, [value]);

  return (
    <MapContext.Provider value={{ state, dispatch }}>
      {children}
    </MapContext.Provider>
  );
};

MapContainer.propTypes = {
  value: mapValuesType, /** this is the value of the controlled component */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default memo(MapContainer);
