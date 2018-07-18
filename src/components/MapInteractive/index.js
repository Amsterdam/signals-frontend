import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import amaps from '../../static/pointquery.iife';

import './style.scss';

const DEFAULT_ZOOM_LEVEL = 14;
const PREVIEW_ZOOM_LEVEL = 16;

class Map extends React.Component {
  componentDidMount() {
    const options = {
      layer: 'standaard',
      target: 'mapdiv',
      marker: false,
      search: true,
      zoom: DEFAULT_ZOOM_LEVEL,
      onQueryResult: this.props.onQueryResult
    };

    this.map = amaps.createMap(options);
  }

  componentWillReceiveProps(props) {
    if (!isEqual(props.location, this.props.location)) {
      const location = new window.L.LatLng(props.location.geometrie.coordinates[0], props.location.geometrie.coordinates[1]);
      this.map.then((map) => {
        map.setView(location, PREVIEW_ZOOM_LEVEL);
      });

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

Map.defaultProps = {
  location: {},
  onQueryResult: () => {}
};

Map.propTypes = {
  location: PropTypes.object,
  onQueryResult: PropTypes.func
};

export default Map;
