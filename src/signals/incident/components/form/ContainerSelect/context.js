import React from 'react';
import PropTypes from 'prop-types';

const ContainerSelectContext = React.createContext();

export const ContainerSelectProvider = ({ value, children }) => (
  <ContainerSelectContext.Provider value={value}>
    {children}
  </ContainerSelectContext.Provider>
);

ContainerSelectProvider.propTypes = {
  value: PropTypes.shape({}).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default ContainerSelectContext;

