import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import pointquery from 'amsterdam-amaps/dist/pointquery';

import './style.scss';

const DEFAULT_ZOOM_LEVEL = 14;

class MapInteractive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      map: props.map
    };
  }

  componentWillReceiveProps(props) {
    if (!this.state.map) {
      const options = {
        layer: 'standaard',
        target: 'mapdiv-interactive',
        marker: false,
        search: true,
        zoom: DEFAULT_ZOOM_LEVEL,
        onQueryResult: this.props.onQueryResult
      };

      if (props.location.geometrie) {
        options.marker = true;
        options.center = {
          longitude: props.location.geometrie.coordinates[0],
          latitude: props.location.geometrie.coordinates[1]
        };
      }
      this.setState({
        map: pointquery.createMap(options)
      });
    }
    const input = document.querySelector('#nlmaps-geocoder-control-input');
    if (input) {
      input.setAttribute('placeholder', 'Zoek adres');
    }
    if (input && !isEqual(props.location, this.props.location)) {
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
  location: PropTypes.object,
  map: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  onQueryResult: PropTypes.func.isRequired
};

export default MapInteractive;
