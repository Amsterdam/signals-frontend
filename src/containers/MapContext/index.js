import React, { useReducer, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Context from './context';
import reducer, { initialState, mapValuesType } from './reducer';
import { setValuesAction } from './actions';

const MapContext = ({ value, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch(setValuesAction(value));
  }, [value]);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  );
};

MapContext.propTypes = {
  value: mapValuesType, /** this is the value of the controlled component */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default memo(MapContext);
