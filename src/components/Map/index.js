import React from 'react';
import PropTypes from 'prop-types';

import amaps from 'amsterdam-amaps/dist/amaps';

import './style.scss';

const PREVIEW_ZOOM_LEVEL = '16';
const smallIcon = global.L.icon({
  iconUrl: 'https://map.data.amsterdam.nl/dist/images/svg/marker.svg',
  iconSize: [20, 20],
  iconAnchor: [10, 19]
});
const defaultIcon = global.L.icon({
  iconUrl: 'https://map.data.amsterdam.nl/dist/images/svg/marker.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 39]
});

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

    this.renderMarker(this.props.latlng.latitude, this.props.latlng.longitude);
  }

  componentDidUpdate(prevProps) {
    const lat = this.props.latlng.latitude;
    const lng = this.props.latlng.longitude;
    if (lat !== prevProps.latlng.latitude || lng !== prevProps.latlng.longitude) {
      this.renderMarker(lat, lng);
    }
  }

  map = {};

  renderMarker(lat, lng) {
    L.DomUtil.empty(this.map.getPane('markerPane'));

    this.map.setView({ lat, lng });

    const marker = L.marker(
      [lat, lng],
      { icon: this.props.useSmallMarker ? smallIcon : defaultIcon }
    );
    marker.addTo(this.map);
  }

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
  useSmallMarker: false,
  zoom: PREVIEW_ZOOM_LEVEL
};

Map.propTypes = {
  latlng: PropTypes.object,
  hideAttribution: PropTypes.bool,
  hideZoomControls: PropTypes.bool,
  useSmallMarker: PropTypes.bool,
  zoom: PropTypes.string
};

export default Map;
