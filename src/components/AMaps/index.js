import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from 'shared/components/LoadingIndicator';

import amaps from '../../static/amaps.es';
import { wgs84ToRd } from '../../shared/services/crs-converter/crs-converter';

import './style.scss';

const DEFAULT_ZOOM_LEVEL = 14;
// The BAG_ENDPOINT is being used in the amaps implementation, so we can't move it to a saga
const BAG_ENDPOINT = 'https://api.data.amsterdam.nl/bag/nummeraanduiding/?format=json&locatie=';

class AMaps extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static requestFormatter(baseUrl, xy) {
    const xyRd = wgs84ToRd({ longitude: xy.x, latitude: xy.y });
    return `${baseUrl}${xyRd.x},${xyRd.y},50`;
  }

  static responseFormatter(res) {
    const filtered = res.results.filter((x) =>
      x.hoofdadres === true
    );
    return filtered.length > 0 ? filtered[0] : null;
  }

  constructor(props) {
    super(props);
    this.onMapClick = this.onMapClick.bind(this);
    this.setQueryAndZoom = this.setQueryAndZoom.bind(this);
    this.setMarkerOnSearch = this.setMarkerOnSearch.bind(this);
  }

  componentDidMount() {
    this.map = amaps.createMap({
      style: 'standaard',
      target: 'mapdiv',
      marker: false,
      search: !this.props.preview,
      zoom: DEFAULT_ZOOM_LEVEL
    });

    const clicks = amaps.clickProvider(this.map);
    this.singleMarker = amaps.singleMarker(this.map);
    if (!this.props.preview) {
      const featureQuery = amaps.queryFeatures(
        clicks,
        BAG_ENDPOINT,
        Map.requestFormatter,
        Map.responseFormatter
      );

      clicks.subscribe(this.singleMarker);
      featureQuery.subscribe(this.onMapClick);
    }
    amaps.on('search-select', (loc) => this.setMarkerOnSearch(loc));

    if (!this.inputField) {
      this.inputField = document.querySelector('#nlmaps-geocoder-control-input');
    }

    if (this.inputField) {
      this.inputField.addEventListener('blur', () => {
        setTimeout(() => {
          document.querySelector('#nlmaps-geocoder-control-results').classList.add('nlmaps-hidden');
        }, 200);
      });
    }

    this.setQueryAndZoom();
  }

  componentDidUpdate() {
    this.setQueryAndZoom();
  }

  onMapClick(t, data) {
    if (t === 1) {
      if (data.queryResult) {
        this.props.onLocationChange(
          data.queryResult._display, // eslint-disable-line no-underscore-dangle
          data.latlng
        );
      } else {
        this.props.getGeo(data);
      }
    }
  }

  setMarkerOnSearch(fullLocation) {
    const latlng = window.L.latLng(fullLocation.latlng.coordinates[1], fullLocation.latlng.coordinates[0]);
    this.singleMarker(1, { latlng });
    this.props.onLocationChange(fullLocation.location, latlng);
  }

  setQueryAndZoom() {
    if (!this.props.preview) {
      if (!this.inputField) {
        this.inputField = document.querySelector('#nlmaps-geocoder-control-input');
      }
      this.inputField.value = this.props.location;
    }

    if (this.props.latlng && this.props.latlng.lat) {
      const latlng = new window.L.LatLng(this.props.latlng.lat, this.props.latlng.lng);
      this.map.setView(latlng);
      this.singleMarker(1, { latlng });
    }
  }

  render() {
    return (
      <div className="map-component">
        <div className="row">
          <div className="col-12">
            { this.props.isLoading && (
              <span className="map-component__loading">
                <LoadingIndicator />
              </span>
            )}
            <div className="map">
              <div id="mapdiv">
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AMaps.propTypes = {
  onLocationChange: PropTypes.func,
  location: PropTypes.string,
  latlng: PropTypes.object,
  preview: PropTypes.bool,
  isLoading: PropTypes.bool,
  getGeo: PropTypes.func
};

AMaps.defaultProps = {
  onLocationChange: null,
  location: '',
  preview: false,
  isLoading: false
};

export default AMaps;
