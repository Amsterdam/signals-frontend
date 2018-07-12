import React from 'react';
import PropTypes from 'prop-types';

import amaps from '../../static/pointquery.iife';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

import './style.scss';

const DEFAULT_ZOOM_LEVEL = 14;
const PREVIEW_ZOOM_LEVEL = 16;

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latlng: props.latlng,
    };
  }

  componentDidMount() {
    console.log('componentDidMount', this.props);
    const hasLocation = this.props.latlng.latitude && this.props.latlng.longitude;
    // console.log('hasLocation', hasLocation);
    const options = {
      layer: 'standaard',
      target: 'mapdiv',
      marker: true,
      search: true,
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

  componentWillReceiveProps(props) {
    console.log('componentWillReceiveProps', props.latlng);
    if (props.latlng.latitude && props.latlng.longitude) {
      const latlng = new window.L.LatLng(props.latlng.latitude, props.latlng.longitude);
      this.map.then((map) => {
        map.setView(latlng, PREVIEW_ZOOM_LEVEL);
      });
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
