import React, { useReducer, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import MapContext from './context';
import reducer, { initialState, mapValuesType } from './reducer';
import MapImplementation from './MapImplementation';
import { setValuesAction } from './actions';

export const MapWithContext = (value, onValueChanged, children, ...otherProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch(setValuesAction(value));
  }, [value]);

  return (
    <MapContext.Provider value={{ state, dispatch, onValueChanged }}>
      <MapImplementation {...otherProps}>{children}</MapImplementation>
    </MapContext.Provider>
  );
};

MapWithContext.propTypes = {
  value: mapValuesType, /** this is the value of the controlled component */
  onValueChanged: PropTypes.func, /** this is the callback of the controlled component */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default memo(MapWithContext);
