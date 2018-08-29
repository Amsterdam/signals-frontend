import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import amaps from '../../static/pointquery.iife';

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
        target: 'mapdiv',
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
        map: amaps.createMap(options)
      });
    }
    if (!isEqual(props.location, this.props.location)) {
      const input = document.querySelector('#nlmaps-geocoder-control-input');
      if (input && props.location.address) {
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
        <div className="row">
          <div className="col-12">
            <div className="map">
              <div id="mapdiv" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MapInteractive.defaultProps = {
  location: {},
  map: false,
  onQueryResult: () => {}
};

MapInteractive.propTypes = {
  location: PropTypes.object,
  map: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  onQueryResult: PropTypes.func
};

export default MapInteractive;
