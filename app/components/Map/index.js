import React from 'react';
import PropTypes from 'prop-types';
import { amaps } from '../../static/amaps.iife';
import './style.scss';

import MarkerIcon from '../../../node_modules/stijl/dist/images/svg/marker.svg';

const DEFAULT_ZOOM_LEVEL = 14;
const HIGHLIGHTED_ZOOM_LEVEL = 16;

class Map extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.nlmaps = window.nlmaps;

    this.onMapClick = this.onMapClick.bind(this);
    this.setQueryAndZoom = this.setQueryAndZoom.bind(this);

    this.state = {
      isLoading: false
    };
  }

  componentDidMount() {
    const Marker = new window.L.icon({ // eslint-disable-line new-cap
      iconUrl: MarkerIcon,
      iconSize: [40, 40],
      iconAnchor: [20, 39]
    });
    window.L.Marker.prototype.options.icon = Marker;
    window.L.icon.Default = Marker;

    this.map = this.nlmaps.createMap({
      style: 'standaard',
      target: 'mapdiv',
      marker: false,
      search: !this.props.preview,
      zoom: DEFAULT_ZOOM_LEVEL
    });

    const clicks = this.nlmaps.clickProvider(this.map);
    const singleMarker = this.nlmaps.singleMarker(this.map);
    if (!this.props.preview) {
      const featureQuery = this.nlmaps.queryFeatures(
        clicks,
        'https://api.data.amsterdam.nl/bag/nummeraanduiding/?format=json&locatie=',
        amaps.bagApiRequestFormatter,
        amaps.bagApiResponseFormatter
      );

      clicks.subscribe(singleMarker);
      featureQuery.subscribe(this.onMapClick);
    }

    this.map.on('moveend', () => {
      this.removeMarkerOnSearch();
      this.setMarkerOnSearch();
    });

    this.setQueryAndZoom();
  }

  componentDidUpdate() {
    this.setQueryAndZoom();
  }

  onMapClick(t, data) {
    if (t === 1) {
      this.removeMarkerOnSearch();
      this.setState({
        isLoading: true
      });
      if (data.queryResult) {
        this.onLocationChange(
          data.queryResult._display, // eslint-disable-line no-underscore-dangle
          data.latlng
        );
        this.setState({
          isLoading: false
        });
      } else {
        // fetch nearby object if no address is found
        fetch(`https://acc.api.data.amsterdam.nl/geosearch/atlas/?lat=${data.latlng.lat}&lon=${data.latlng.lng}&radius=0`)
        .then((res) => res.json())
        .then((res) => {
          this.onLocationChange(
            res.features[0].properties.display,
            data.latlng
          );
          this.setState({
            isLoading: false
          });
        });
      }
    }
  }

  onLocationChange(location, latlng) {
    this.props.onLocationChange(location, latlng);
  }

  setMarkerOnSearch() {
    const latlng = window.L.latLng(this.map.getCenter());
    this.markerOnSearch = window.L.marker(latlng).addTo(this.map);
  }

  setQueryAndZoom() {
    if (!this.props.preview) {
      if (!this.inputField) {
        this.inputField = document.querySelector('#nlmaps-geocoder-control-input');
      }
      this.inputField.value = this.props.location;
    }

    if (this.props.latlng) {
      this.map.setView(new window.L.LatLng(this.props.latlng.lat, this.props.latlng.lng), HIGHLIGHTED_ZOOM_LEVEL);
    }
  }

  removeMarkerOnSearch() {
    if (this.markerOnSearch) {
      this.map.removeLayer(this.markerOnSearch);
    }
  }

  render() {
    return (
      <div className="map-component">
        <div className="row">
          <div className="col-12">
            { this.state.isLoading && (
              <span className="map-component__loading">
                <div className="progress-wrapper">
                  <div className="progress-indicator progress-red"></div>
                  <div className="progress-txt">Laden...</div>
                </div>
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

Map.propTypes = {
  onLocationChange: PropTypes.func,
  location: PropTypes.string,
  latlng: PropTypes.object,
  preview: PropTypes.bool
};

Map.defaultProps = {
  onLocationChange: null,
  location: '',
  preview: false
};

export default Map;
