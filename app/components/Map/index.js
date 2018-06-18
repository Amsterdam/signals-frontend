import React from 'react';
import { amaps } from '../../static/amaps.iife';
import './style.scss';

class Map extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.nlmaps = window.nlmaps;
  }

  componentDidMount() {
    this.map = this.nlmaps.createMap({
      style: 'standaard',
      target: 'mapdiv',
      marker: true,
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
  }

  onMapClick(t, data) {
    if (t === 1) {
      console.log(data);
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
      </div>
    );
  }
}

export default Map;
