/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-did-mount-set-state */

import React from 'react';
import PropTypes from 'prop-types';
// import { isEqual } from 'lodash';

import pointquery from 'amsterdam-amaps/dist/pointquery';

import './style.scss';

const DEFAULT_ZOOM_LEVEL = 14;
const PREVIEW_ZOOM_LEVEL = 16;

class MapInteractive extends React.Component {
  static initMap(props) {
    const options = {
      layer: 'standaard',
      target: 'mapdiv-interactive',
      marker: false,
      search: true,
      zoom: DEFAULT_ZOOM_LEVEL,
      onQueryResult: props.onQueryResult
    };

    if (props.location.geometrie) {
      options.zoom = PREVIEW_ZOOM_LEVEL;
      options.marker = true;
      options.center = {
        longitude: props.location.geometrie.coordinates[0],
        latitude: props.location.geometrie.coordinates[1]
      };
    }

    return pointquery.createMap(options);
  }

  constructor(props) {
    super(props);

    this.state = {
      map: props.map
    };

    this.updateInput = this.updateInput.bind(this);
  }

  static getDerivedStateFromProps(props, prevState) {
    if (!prevState.map && document.getElementById('mapdiv-interactive')) {
      return {
        map: MapInteractive.initMap(props)
      };
    }

    return null;
  }

  componentDidMount() {
    if (!this.state.map) {
      this.setState({
        map: MapInteractive.initMap(this.props)
      });
    }
    this.updateInput(this.props);
  }

  componentDidUpdate() {
    if (!this.state.map) {
      this.setState({
        map: MapInteractive.initMap(this.props)
      });
    }
    this.updateInput(this.props);
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
  map: false
};

MapInteractive.propTypes = {
  // location: PropTypes.object,
  map: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
};

export default MapInteractive;
