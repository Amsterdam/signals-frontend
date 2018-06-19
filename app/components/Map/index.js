import React from 'react';
import { amaps } from '../../static/amaps.iife';
import './style.scss';

import MarkerIcon from '../../../node_modules/stijl/dist/images/svg/marker.svg';

class Map extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.nlmaps = window.nlmaps;

    this.onMapClick = this.onMapClick.bind(this);

    this.state = {
      locationDisplay: '',
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
      search: true,
      zoom: 14
    });

    const clicks = this.nlmaps.clickProvider(this.map);
    const singleMarker = this.nlmaps.singleMarker(this.map);
    const featureQuery = this.nlmaps.queryFeatures(
      clicks,
      'https://api.data.amsterdam.nl/bag/nummeraanduiding/?format=json&locatie=',
      amaps.bagApiRequestFormatter,
      amaps.bagApiResponseFormatter
    );
    clicks.subscribe(singleMarker);
    featureQuery.subscribe(this.onMapClick);


    this.map.on('moveend', () => {
      this.removeMarkerOnSearch();
      this.setMarkerOnSearch();
    });
  }

  componentDidUpdate() {
    if (!this.inputField) {
      this.inputField = document.querySelector('#nlmaps-geocoder-control-input');
    }
    this.inputField.value = this.state.locationDisplay;
  }

  onMapClick(t, data) {
    if (t === 1) {
      this.removeMarkerOnSearch();
      this.setState({
        isLoading: true
      });
      if (data.queryResult) {
        this.setState({
          locationDisplay: data.queryResult._display, // eslint-disable-line no-underscore-dangle
          latlng: data.latlng,
          isLoading: false
        });
      } else {
        // fetch nearby object if no address is found
        // TODO proper saga implementation
        fetch(`https://acc.api.data.amsterdam.nl/geosearch/atlas/?lat=${data.latlng.lat}&lon=${data.latlng.lng}&radius=0`)
        .then((res) => res.json())
        .then((res) => {
          this.setState({
            locationDisplay: res.features[0].properties.display,
            latlng: data.latlng,
            isLoading: false
          });
        });
      }
    }
  }

  setMarkerOnSearch() {
    const latlng = window.L.latLng(this.map.getCenter());
    this.markerOnSearch = window.L.marker(latlng).addTo(this.map);
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
          <div className="col-10 offset-1">
            <div className="map">
              <div id="mapdiv">
              </div>
            </div>
          </div>
        </div>
        { this.state.isLoading && (
          <span>Laden...</span>
        )}
      </div>
    );
  }
}

export default Map;
