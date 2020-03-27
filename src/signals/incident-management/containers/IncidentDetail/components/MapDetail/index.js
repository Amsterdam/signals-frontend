import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Map from 'components/Map';

import { locationType } from 'shared/types';

const Wrapper = styled.div`
  position: relative;
  z-index: 0;

  #mapdiv {
    height: 474px;
  }
`;

const MapDetail = ({ value, hideAttribution, hideZoomControls, useSmallMarker, zoom }) => {
  const location = value?.geometrie?.coordinates;
  const latlng = location && { latitude: location[1], longitude: location[0] };

  return (
    latlng && (
      <Wrapper>
        <Map
          latlng={latlng}
          hideAttribution={hideAttribution}
          hideZoomControls={hideZoomControls}
          useSmallMarker={useSmallMarker}
          zoom={zoom}
        />
      </Wrapper>
    )
  );
};

MapDetail.propTypes = {
  value: locationType.isRequired,
  hideAttribution: PropTypes.bool,
  hideZoomControls: PropTypes.bool,
  useSmallMarker: PropTypes.bool,
  zoom: PropTypes.string,
};

export default MapDetail;
