/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

import amaps from '../../static/amaps.es';
// import { wgs84ToRd } from '../../shared/services/crs-converter/crs-converter';

import './style.scss';

const DEFAULT_ZOOM_LEVEL = 14;

class Map extends React.Component {
  constructor(props) {
    console.log('cont', props);
    super(props);

    this.state= {
      map: props.map
    };

    this.handleQueryResult = this.handleQueryResult.bind(this);
  }

  handleQueryResult(data) {
    console.log('handleQueryResult', data);
  }

  componentDidMount() {
    const map = amaps.createMap({
      style: 'standaard',
      target: 'mapdiv',
      search: !this.props.preview,
      zoom: DEFAULT_ZOOM_LEVEL,
      onQueryResult: this.handleQueryResult
    });

    this.setState({
      map
    });
  }

  render() {
    return (
      <div className="map">
        <div id="mapdiv" />
      </div>
    );
  }
}

Map.defaultProps = {
  map: {},
  preview: false
};

Map.propTypes = {
  map: PropTypes.object,
  preview: PropTypes.bool
};

export default Map;
