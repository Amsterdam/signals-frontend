import React, { memo , useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Map, Marker } from '@datapunt/react-maps';
import { ViewerContainer } from '@datapunt/asc-ui';
import { Zoom } from '@datapunt/amsterdam-react-maps/lib/components';
import styled from '@datapunt/asc-core';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import BackgroundLayer from 'components/BackgroundLayer';
import { markerIcon } from 'shared/services/configuration/map-markers';
import { feature2location } from 'shared/services/map-location';
import pointQueryService from './services/pointQueryService';

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
  const [marker, setMarker] = useState();

  useEffect(() => {
    if (!marker || !location.geometrie) return;

    const opacity = 1;
    const latlng = feature2location(location.geometrie);
    marker.setLatLng(latlng);
    marker.setOpacity(opacity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marker, location]);

  const clickHandler = useCallback(async e => {
    const pointInfo = await pointQueryService(e);
    onLocationChange(pointInfo);
  }, [onLocationChange]);

  return (
    <MapWrapper>
      <StyledMap
        options={MAP_OPTIONS} events={
          { click: clickHandler }
        }
      >
        <StyledViewerContainer bottomRight={<Zoom />} />
        <Marker
          setInstance={setMarker}
          args={[{
            lat: 0,
            lng: 0,
          }]}
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
  location: PropTypes.shape({
    geometrie: PropTypes.shape({}),
    address: PropTypes.shape({}),
  }).isRequired,
  onLocationChange: PropTypes.func.isRequired,
};

export default memo(MapEditor);
