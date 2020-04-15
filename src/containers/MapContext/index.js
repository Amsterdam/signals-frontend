import React, { useReducer, memo } from 'react';
import PropTypes from 'prop-types';
import Context from './context';
import reducer, { initialState } from './reducer';

const MapContext = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  );
};

MapContext.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default memo(MapContext);
