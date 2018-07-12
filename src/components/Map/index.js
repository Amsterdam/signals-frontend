import React from 'react';
import PropTypes from 'prop-types';

import amaps from '../../static/pointquery.iife';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

import './style.scss';

const DEFAULT_ZOOM_LEVEL = 14;
const PREVIEW_ZOOM_LEVEL = 17;

class Map extends React.Component {
  componentDidMount() {
    const hasLocation = this.props.latlng.latitude && this.props.latlng.longitude;
    console.log('hasLocation', hasLocation);
    const options = {
      layer: 'standaard',
      target: 'mapdiv',
      marker: hasLocation,
      search: !this.props.preview,
      zoom: this.props.preview ? PREVIEW_ZOOM_LEVEL : DEFAULT_ZOOM_LEVEL
    };

    if (hasLocation) {
      options.center = {
        longitude: this.props.latlng.longitude,
        latitude: this.props.latlng.latitude
      };
    }

    if (!this.props.preview) {
      options.onQueryResult = this.props.onQueryResult;
    }

    this.map = amaps.createMap(options);
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
  map: {},
  latlng: {},
  preview: false,
  onQueryResult: () => {}
};

Map.propTypes = {
  // map: PropTypes.object,
  latlng: PropTypes.object,
  preview: PropTypes.bool,
  onQueryResult: PropTypes.func
};

export default Map;
