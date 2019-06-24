import React from 'react';
import PropTypes from 'prop-types';

import amaps from 'amsterdam-amaps/dist/amaps';

import './style.scss';

const PREVIEW_ZOOM_LEVEL = 16;

class Map extends React.Component {
  componentDidMount() {
    this.map = amaps.createMap({
      center: {
        latitude: this.props.latlng.latitude,
        longitude: this.props.latlng.longitude
      },
      layer: 'standaard',
      target: 'mapdiv',
      marker: true,
      search: false,
      zoom: this.props.zoom
    });

    if (this.props.hideAttribution) {
      this.map.attributionControl.remove();
    }

    if (this.props.hideZoomControls) {
      this.map.zoomControl.remove();
    }
  }

  map = {};

  render() {
    return (
      <div className="map-component">
        <div className="map">
          <div className="map-container" id="mapdiv" />
        </div>
      </div>
    );
  }
}

Map.defaultProps = {
  latlng: {},
  hideAttribution: false,
  hideZoomControls: false,
  zoom: PREVIEW_ZOOM_LEVEL
};

Map.propTypes = {
  latlng: PropTypes.object,
  hideAttribution: PropTypes.bool,
  hideZoomControls: PropTypes.bool,
  zoom: PropTypes.number
};

export default Map;
