/* eslint-disable react/no-did-mount-set-state */

import React from 'react';
import PropTypes from 'prop-types';
import pointquery from 'amsterdam-amaps/dist/pointquery';

import 'leaflet/dist/leaflet';
import 'leaflet/dist/leaflet.css';
import 'amsterdam-amaps/dist/nlmaps/dist/assets/css/nlmaps.css';

import './style.scss';

const DEFAULT_ZOOM_LEVEL = 14;
const PREVIEW_ZOOM_LEVEL = 16;
const customIcon = global.window.L.icon({
  iconUrl: 'https://map.data.amsterdam.nl/dist/images/svg/marker.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 39],
});

class MapInteractive extends React.Component {
  static initMap(props) {
    const options = {
      layer: 'standaard',
      target: 'mapdiv-interactive',
      marker: false,
      search: true,
      zoom: DEFAULT_ZOOM_LEVEL,
      onQueryResult: props.onQueryResult,
    };

    if (props.location.geometrie) {
      options.zoom = PREVIEW_ZOOM_LEVEL;
      options.marker = true;
      options.center = {
        longitude: props.location.geometrie.coordinates[0],
        latitude: props.location.geometrie.coordinates[1],
      };
    }
    return pointquery.createMap(options);
  }

  constructor(props) {
    super(props);

    this.state = {
      map: props.map,
    };

    this.updateInput = this.updateInput.bind(this);
  }

  componentDidMount() {
    MapInteractive.initMap(this.props).then(map => {
      this.setState({ map });
    });

    this.updateInput(this.props);
  }

  componentDidUpdate() {
    this.updateInput(this.props);

    if (this.state.map && this.props.location.geometrie) {
      let markerFound = false;

      /* istanbul ignore next */
      this.state.map.eachLayer(layer => {
        if (layer instanceof global.window.L.Marker) {
          markerFound = true;
        }
      });

      /* istanbul ignore next */
      if (!markerFound) {
        global.window.L.marker(
          [this.props.location.geometrie.coordinates[1], this.props.location.geometrie.coordinates[0]],
          { icon: customIcon }
        ).addTo(this.state.map);
      }
    }
  }

  updateInput(props) {
    const input = document.querySelector('#nlmaps-geocoder-control-input');
    if (input) {
      input.setAttribute('placeholder', 'Zoek adres');

      if (props.location && props.location.address) {
        const address = props.location.address;
        const toevoeging = address.huisnummer_toevoeging ? `-${address.huisnummer_toevoeging}` : '';
        const display = `${address.openbare_ruimte} ${address.huisnummer}${address.huisletter}${toevoeging}, ${address.postcode} ${address.woonplaats}`;
        input.setAttribute('value', display);
      }
    }
  }

  render() {
    return (
      <div className="map-component">
        <div className="map">
          <div id="mapdiv-interactive" />
        </div>
      </div>
    );
  }
}

MapInteractive.defaultProps = {
  location: {},
  map: false,
};

MapInteractive.propTypes = {
  location: PropTypes.object,
  map: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

export default MapInteractive;
