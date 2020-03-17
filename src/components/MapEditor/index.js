import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Map, Marker } from '@datapunt/react-maps';
import { ViewerContainer } from '@datapunt/asc-ui';
import { Zoom } from '@datapunt/amsterdam-react-maps/lib/components';
import styled from '@datapunt/asc-core';
import MAP_OPTIONS, { DEFAULT_MARKER_POSITION } from 'shared/services/configuration/map-options';
import BackgroundLayer from 'components/BackgroundLayer';
import { markerIcon } from 'shared/services/configuration/map-markers';


const MapWrapper = styled.div`
  position: relative;
`;

const StyledMap = styled(Map)`
  width: 100%;
  height: 450px;
`;

const StyledViewerContainer = styled(ViewerContainer)`
  z-index: 400;
`;

const MapEditor = ({ location, onLocationChange }) => {
  console.log('location', location, onLocationChange);

  return (
    <MapWrapper>
      <StyledMap options={MAP_OPTIONS}>
        <StyledViewerContainer bottomRight={<Zoom />} />
        <Marker
          args={[DEFAULT_MARKER_POSITION]}
          options={{
            icon: markerIcon,
            opacity: 0,
          }}
        />

        <BackgroundLayer />
      </StyledMap>
    </MapWrapper>
  );
};

MapEditor.propTypes = {
  location: PropTypes.shape({}).isRequired,
  onLocationChange: PropTypes.func.isRequired,
};

export default memo(MapEditor);
