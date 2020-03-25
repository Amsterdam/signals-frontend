import React, { useContext, useCallback } from 'react';
import styled from '@datapunt/asc-core';
import Map from './Map';
import MapContext from './context';

const StyledMap = styled(Map)`
  height: 450px;
  width: 100%;
`;



const MapImplementation = ({ ...otherProps }) => {
  const { state } = useContext(MapContext);

  const clickHandler = useCallback(async e => {
    console.log(state);
    console.log(e);
  }, [state]);

  return (
    <StyledMap
      {...otherProps} events={
        { click: clickHandler }
      }
    >
      {/* Here comes the Marker */}
    </StyledMap>

  );
};

MapImplementation.defaultProps = {
};

MapImplementation.propTypes = {
};

export default MapImplementation;
