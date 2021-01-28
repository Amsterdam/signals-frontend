import React, { useReducer, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import Context from './context';
import reducer, { initialState } from './reducer';

const MapContext = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
};

MapContext.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default memo(MapContext);
